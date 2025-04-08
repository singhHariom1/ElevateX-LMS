import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetInstructorSalesQuery } from "@/features/api/purchaseApi";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetInstructorSalesQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError)
    return <h1 className="text-red-500">Failed to get sales data</h1>;

  const { totalSales = 0, totalRevenue = 0, courseSales = [] } = data || {};

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
        </CardContent>
      </Card>

      {/* Course Sales Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseSales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30} // Rotated labels for better visibility
                textAnchor="end"
                interval={0} // Display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "price") return [`₹${value}`, "Price"];
                  if (name === "sales") return [value, "Sales"];
                  if (name === "revenue") return [`₹${value}`, "Revenue"];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4a90e2" // Blue for sales
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#50c878" // Green for revenue
                strokeWidth={3}
                dot={{ stroke: "#50c878", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
