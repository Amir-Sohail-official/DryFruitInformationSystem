import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import {
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaCity,
  FaMapMarkedAlt,
  FaCommentDots,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardHome() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const usersLimit = 5;
  const productsLimit = 5;
  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/overview");
        setStats(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#14b8a6",
    "#60a5fa",
  ];

  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Shops", value: stats.totalShops },
    { name: "Products", value: stats.totalProducts },
    { name: "Cities", value: stats.totalCities },
    { name: "Provinces", value: stats.totalProvinces },
    { name: "Feedback", value: stats.totalFeedback },
    { name: "Contacts", value: stats.totalContacts },
    { name: "Seasons", value: stats.totalSeasons },
  ].filter((item) => item.value);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/users?page=${usersPage}&limit=${usersLimit}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = res.data?.data?.users || [];
        const total = res.data?.totalUsers || list.length;
        setUsers(list);
        setUsersTotalPages(Math.max(1, Math.ceil(total / usersLimit)));
      } catch (e) {
        console.error("Failed to fetch users", e);
      }
    };
    fetchUsers();
  }, [usersPage, token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products?page=${productsPage}&limit=${productsLimit}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list =
          res.data?.data?.products ||
          res.data?.products ||
          [];
        const total =
          res.data?.totalProducts ||
          list.length;
        setProducts(list);
        setProductsTotalPages(Math.max(1, Math.ceil(total / productsLimit)));
      } catch (e) {
        console.error("Failed to fetch products", e);
      }
    };
    fetchProducts();
  }, [productsPage, token]);

  if (loading) {
    return (
      <div className="w-full mt-16 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-3 text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error)
    return (
      <div className="m-4 p-4 bg-red-50 border border-red-200 text-red-700 text-center rounded">
        {error}
      </div>
    );

  const cardItems = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers size={30} />,
    },
    {
      title: "Total Shops",
      value: stats.totalShops,
      icon: <FaStore size={30} />,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FaBoxOpen size={30} />,
    },
    {
      title: "Total Cities",
      value: stats.totalCities,
      icon: <FaCity size={30} />,
    },
    {
      title: "Total Provinces",
      value: stats.totalProvinces,
      icon: <FaMapMarkedAlt size={30} />,
    },
    {
      title: "Total Feedback",
      value: stats.totalFeedback,
      icon: <FaCommentDots size={30} />,
    },
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: <FaEnvelope size={30} />,
    },
    {
      title: "Total Seasons",
      value: stats.totalSeasons,
      icon: <FaCalendarAlt size={30} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Quick overview of your system stats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cardItems.map((item, i) => (
          <div
            key={i}
            className="rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 p-6 h-40"
          >
            <div className="flex items-center justify-between">
              <div className="opacity-90 text-slate-700">{item.icon}</div>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.title}
              </span>
            </div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{item.value || 0}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h5 className="text-center font-semibold mb-4 text-slate-800">System Overview</h5>
        <div className="w-full h-[300px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Latest Users</h3>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                disabled={usersPage === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 text-sm rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                disabled={usersPage === usersTotalPages}
              >
                Next
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left bg-slate-50">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="px-3 py-2">{u.firstName} {u.lastName}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.role}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={3}>No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-slate-500">Page {usersPage} of {usersTotalPages}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Latest Products</h3>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                disabled={productsPage === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 text-sm rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setProductsPage((p) => Math.min(productsTotalPages, p + 1))}
                disabled={productsPage === productsTotalPages}
              >
                Next
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left bg-slate-50">
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Trending</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-3 py-2">{p.product}</td>
                    <td className="px-3 py-2">{typeof p.price !== "undefined" ? p.price : "-"}</td>
                    <td className="px-3 py-2">{p.trending ? "Yes" : "No"}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={3}>No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-slate-500">Page {productsPage} of {productsTotalPages}</div>
        </div>
      </div>
    </div>
  );
}
