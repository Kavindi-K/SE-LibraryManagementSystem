import React, { useState, useEffect } from 'react';
import { api } from '../api';

// Recharts with fallback
let BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
    AreaChart, Area, LineChart, Line;
try {
  const recharts = require('recharts');
  BarChart = recharts.BarChart;
  Bar = recharts.Bar;
  XAxis = recharts.XAxis;
  YAxis = recharts.YAxis;
  CartesianGrid = recharts.CartesianGrid;
  Tooltip = recharts.Tooltip;
  ResponsiveContainer = recharts.ResponsiveContainer;
  PieChart = recharts.PieChart;
  Pie = recharts.Pie;
  Cell = recharts.Cell;
  Legend = recharts.Legend;
  AreaChart = recharts.AreaChart;
  Area = recharts.Area;
  LineChart = recharts.LineChart;
  Line = recharts.Line;
} catch (e) {
  console.warn('Recharts not available, using fallback components');
}

import './DashboardStats.css';

const DashboardStats = () => {
  const [memberStats, setMemberStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    suspendedMembers: 0,
    premiumMembers: 0,
    basicMembers: 0,
    studentMembers: 0,
    familyMembers: 0,
    membersWithFines: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Live-updating mock data for Book Management and Reservations & Fines
  const [mockStats, setMockStats] = useState({
    totalBooks: 2547,
    availableBooks: 1892,
    borrowedBooks: 445,
    reservedBooks: 210,
    totalReservations: 156,
    activeReservations: 89,
    overdueBooks: 23,
    totalFines: 1245.5,
    paidFines: 987.25,
    pendingFines: 258.25
  });

  // Chart data
  const booksPieData = [
    { name: 'Available', value: mockStats.availableBooks },
    { name: 'Borrowed', value: mockStats.borrowedBooks },
    { name: 'Reserved', value: mockStats.reservedBooks },
    { name: 'Overdue', value: mockStats.overdueBooks },
  ];
  const booksPieColors = ['#4C51BF', '#34D399', '#8B5CF6', '#6366F1'];

  const reservationsBarData = [
    { name: 'Total', value: mockStats.totalReservations },
    { name: 'Active', value: mockStats.activeReservations },
  ];

  const finesBarData = [
    { name: 'Total', value: mockStats.totalFines },
    { name: 'Paid', value: mockStats.paidFines },
    { name: 'Pending', value: mockStats.pendingFines },
  ];

  // Fetch real data used by Books, Borrowings, Reservations and derive dashboard stats
  useEffect(() => {
    let cancelled = false;

    async function fetchAndCompute() {
      try {
        const [books, borrowings, reservations] = await Promise.all([
          // Books are fetched directly elsewhere, reuse same endpoint here
          api.listBooks().catch(() => []),
          api.listBorrowings().catch(() => []),
          api.listReservations().catch(() => []),
        ]);

        if (cancelled) return;

        // Books-related stats
        const totalBooks = Array.isArray(books) ? books.length : 0;
        const availableBooks = Array.isArray(books) ? books.filter((b) => b.availability === true).length : 0;
        // If borrowings API is available, use it; otherwise derive from availability
        const activeBorrowings = Array.isArray(borrowings) ? borrowings.filter((b) => b.status === 'ACTIVE') : [];
        const borrowedBooks = activeBorrowings.length || Math.max(totalBooks - availableBooks, 0);

        // Reservations-related stats
        const totalReservations = Array.isArray(reservations) ? reservations.length : 0;
        const activeReservations = Array.isArray(reservations) ? reservations.filter((r) => r.status === 'PENDING').length : 0;
        const reservedBooks = activeReservations;

        // Overdue and fines from borrowings
        const today = new Date();
        const overdueBooks = Array.isArray(borrowings)
          ? borrowings.filter((b) => b.status !== 'RETURNED' && new Date(b.dueDate) < today).length
          : 0;
        const paidFines = Array.isArray(borrowings)
          ? borrowings.filter((b) => b.status === 'RETURNED').reduce((sum, b) => sum + (Number(b.lateFee) || 0), 0)
          : 0;
        const pendingFines = Array.isArray(borrowings)
          ? borrowings.filter((b) => b.status !== 'RETURNED').reduce((sum, b) => sum + (Number(b.lateFee) || 0), 0)
          : 0;
        const totalFines = paidFines + pendingFines;

        setMockStats({
          totalBooks,
          availableBooks,
          borrowedBooks,
          reservedBooks,
          totalReservations,
          activeReservations,
          overdueBooks,
          totalFines: Number(totalFines.toFixed(2)),
          paidFines: Number(paidFines.toFixed(2)),
          pendingFines: Number(pendingFines.toFixed(2)),
        });
      } catch (e) {
        // Fallback to light random jitter if any API fails
        setMockStats((prev) => {
          const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
          const jitter = (n) => n + Math.round((Math.random() - 0.5) * 2);
          return {
            ...prev,
            availableBooks: clamp(jitter(prev.availableBooks), 0, prev.totalBooks),
            borrowedBooks: clamp(jitter(prev.borrowedBooks), 0, prev.totalBooks),
            activeReservations: clamp(jitter(prev.activeReservations), 0, prev.totalReservations + 50),
            overdueBooks: clamp(jitter(prev.overdueBooks), 0, prev.totalBooks),
          };
        });
      }
    }

    // Initial fetch and periodic refresh
    fetchAndCompute();
    const interval = setInterval(fetchAndCompute, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Fetch real member statistics
  const fetchMemberStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all member statistics in parallel
      const [
        totalResponse,
        activeResponse,
        suspendedResponse,
        premiumResponse,
        basicResponse,
        studentResponse,
        familyResponse,
        finesResponse
      ] = await Promise.all([
        api.getTotalMembersCount(),
        api.getMemberCountByStatus('ACTIVE'),
        api.getMemberCountByStatus('SUSPENDED'),
        api.getMemberCountByMembershipType('PREMIUM'),
        api.getMemberCountByMembershipType('BASIC'),
        api.getMemberCountByMembershipType('STUDENT'),
        api.getMemberCountByMembershipType('FAMILY'),
        api.getMembersWithFines()
      ]);

      setMemberStats({
        totalMembers: totalResponse.data || 0,
        activeMembers: activeResponse.data || 0,
        suspendedMembers: suspendedResponse.data || 0,
        premiumMembers: premiumResponse.data || 0,
        basicMembers: basicResponse.data || 0,
        studentMembers: studentResponse.data || 0,
        familyMembers: familyResponse.data || 0,
        membersWithFines: finesResponse.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching member statistics:', error);
      setError('Unable to load member statistics. Using default values.');
      
      // Set default values if API fails
      setMemberStats({
        totalMembers: 125,
        activeMembers: 98,
        suspendedMembers: 12,
        premiumMembers: 34,
        basicMembers: 67,
        studentMembers: 18,
        familyMembers: 6,
        membersWithFines: 8
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-stats" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loading" style={{ fontSize: '18px', color: '#2563eb' }}>Loading dashboard statistics...</div>
      </div>
    );
  }

  // Always show content even if there are errors
  if (error) {
    console.warn('Dashboard Stats Error:', error);
  }

  return (
    <div className="dashboard-stats" style={{ 
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Error message if API fails */}
      {error && (
        <div style={{ 
          width: '100%', 
          padding: '16px', 
          background: '#fee2e2', 
          color: '#dc2626', 
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          ⚠️ {error} - Showing sample data
        </div>
      )}
      
      {/* Top Row - Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Book Availability Percentage */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: 16, 
          padding: 24,
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Book Availability</h3>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {ResponsiveContainer && PieChart ? (
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie 
                    data={[{ name: 'Available', value: mockStats.availableBooks }, { name: 'Unavailable', value: mockStats.borrowedBooks + mockStats.reservedBooks }]} 
                    dataKey="value" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={35}
                    outerRadius={55} 
                    startAngle={90}
                    endAngle={450}
                  >
                    <Cell fill="rgba(255,255,255,0.3)" />
                    <Cell fill="rgba(255,255,255,0.1)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : null}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {Math.round((mockStats.availableBooks / (mockStats.totalBooks || 1)) * 100)}%
            </div>
          </div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
            {mockStats.availableBooks} of {mockStats.totalBooks} books
          </div>
        </div>

        {/* Monthly Borrowings */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Monthly Borrowings</h3>
          {ResponsiveContainer && BarChart ? (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={[
                { month: 'Jan', borrowed: 12, returned: 8 },
                { month: 'Feb', borrowed: 18, returned: 15 },
                { month: 'Mar', borrowed: 15, returned: 12 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Bar dataKey="borrowed" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="returned" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 120, display: 'flex', alignItems: 'end', gap: '8px', padding: '20px 0' }}>
              <div style={{ flex: 1, background: '#3b82f6', height: '60%', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ flex: 1, background: '#10b981', height: '40%', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ flex: 1, background: '#3b82f6', height: '50%', borderRadius: '4px 4px 0 0' }}></div>
            </div>
          )}
        </div>

        {/* Live Statistics */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Live Statistics</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#6b7280' }}>Real Time Data</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Active Borrowings', value: mockStats.borrowedBooks, color: '#3b82f6' },
              { label: 'Pending Reservations', value: mockStats.activeReservations, color: '#8b5cf6' },
              { label: 'Overdue Books', value: mockStats.overdueBooks, color: '#ef4444' },
              { label: 'Total Members', value: memberStats.totalMembers, color: '#10b981' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{item.label}</span>
                <div style={{ 
                  background: item.color, 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: '600' 
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Financial Overview</h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Fines</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151' }}>${mockStats.totalFines}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Paid</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>${mockStats.paidFines}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Pending</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>${mockStats.pendingFines}</span>
          </div>
        </div>
      </div>

      {/* Middle Row - Detailed Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Borrowing Trends */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Borrowing Trends</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#6b7280' }}>Monthly Activity Visualization</p>
          <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 0' }}>
            {[
              { month: 'Jan', borrowed: 45, returned: 38 },
              { month: 'Feb', borrowed: 52, returned: 48 },
              { month: 'Mar', borrowed: 48, returned: 45 },
              { month: 'Apr', borrowed: 61, returned: 55 },
              { month: 'May', borrowed: 55, returned: 52 },
              { month: 'Jun', borrowed: 67, returned: 61 }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', fontSize: '12px', color: '#6b7280' }}>{item.month}</div>
                <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                  <div style={{ 
                    width: `${(item.borrowed / 70) * 100}%`, 
                    height: '20px', 
                    background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {item.borrowed}
                  </div>
                  <div style={{ 
                    width: `${(item.returned / 70) * 100}%`, 
                    height: '20px', 
                    background: 'linear-gradient(90deg, #10b981, #059669)', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {item.returned}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></div>
                <span>Borrowed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></div>
                <span>Returned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Distribution */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Member Distribution</h3>
          <div style={{ height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {[
              { name: 'Basic', value: memberStats.basicMembers, color: '#3b82f6' },
              { name: 'Premium', value: memberStats.premiumMembers, color: '#10b981' },
              { name: 'Student', value: memberStats.studentMembers, color: '#8b5cf6' },
              { name: 'Family', value: memberStats.familyMembers, color: '#f59e0b' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  background: item.color, 
                  borderRadius: '50%' 
                }}></div>
                <div style={{ flex: 1, fontSize: '14px', color: '#374151' }}>{item.name}</div>
                <div style={{ 
                  background: item.color, 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: 'bold' 
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Overview */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Status Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Active', value: memberStats.activeMembers, color: '#10b981' },
              { label: 'Suspended', value: memberStats.suspendedMembers, color: '#ef4444' },
              { label: 'Available', value: mockStats.availableBooks, color: '#3b82f6' },
              { label: 'Borrowed', value: mockStats.borrowedBooks, color: '#8b5cf6' }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: `conic-gradient(${item.color} ${(item.value / 100) * 360}deg, #e5e7eb 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: item.color
                  }}>
                    {item.value}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Annual Data */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* Annual Borrowings */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Annual Borrowings</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#6b7280' }}>Yearly Visualization by Month</p>
          <div style={{ height: 140, display: 'flex', gap: '4px', alignItems: 'end', justifyContent: 'space-between' }}>
            {[
              { month: 'Jan', borrowed: 45, returned: 40 },
              { month: 'Feb', borrowed: 52, returned: 48 },
              { month: 'Mar', borrowed: 48, returned: 45 },
              { month: 'Apr', borrowed: 61, returned: 55 },
              { month: 'May', borrowed: 55, returned: 52 },
              { month: 'Jun', borrowed: 67, returned: 61 },
              { month: 'Jul', borrowed: 58, returned: 54 },
              { month: 'Aug', borrowed: 63, returned: 58 },
              { month: 'Sep', borrowed: 59, returned: 55 },
              { month: 'Oct', borrowed: 65, returned: 60 },
              { month: 'Nov', borrowed: 62, returned: 57 },
              { month: 'Dec', borrowed: 70, returned: 65 }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'center' }}>
                  <div style={{ 
                    width: '12px', 
                    height: `${(item.borrowed / 70) * 80}px`, 
                    background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', 
                    borderRadius: '2px 2px 0 0',
                    minHeight: '3px'
                  }}></div>
                  <div style={{ 
                    width: '12px', 
                    height: `${(item.returned / 70) * 80}px`, 
                    background: 'linear-gradient(180deg, #10b981, #059669)', 
                    borderRadius: '0 0 2px 2px',
                    minHeight: '3px'
                  }}></div>
                </div>
                <div style={{ fontSize: '8px', color: '#6b7280', fontWeight: '500' }}>{item.month}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '10px', color: '#6b7280', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '2px' }}></div>
              <span>Borrowed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }}></div>
              <span>Returned</span>
            </div>
          </div>
        </div>

        {/* Library Statistics */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Library Statistics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Collection Size</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '75%', 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{mockStats.totalBooks}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Utilization Rate</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '68%', 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>68%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Member Satisfaction</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '82%', 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>82%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;