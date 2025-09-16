import React, { useMemo } from "react"
import Chart from "react-apexcharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"

const SpendingChart = ({ transactions, type = "pie" }) => {
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense")
    const categoryTotals = {}
    
    expenses.forEach(transaction => {
      const category = transaction.category
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount
    })
    
    const categories = Object.keys(categoryTotals)
    const amounts = Object.values(categoryTotals)
    
    return { categories, amounts }
  }, [transactions])

  const pieOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    colors: [
      "#10B981", "#059669", "#047857", "#065F46",
      "#F59E0B", "#D97706", "#B45309", "#92400E",
      "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"
    ],
    labels: chartData.categories,
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontWeight: 500,
      markers: { width: 8, height: 8 }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Expenses",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                return new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD"
                }).format(total)
              }
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827"
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", fontWeight: 600 },
      formatter: function(val) {
        return val.toFixed(1) + "%"
      }
    },
    tooltip: {
      style: { fontSize: "12px" },
      y: {
        formatter: (value) => new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(value)
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        legend: { position: "bottom" },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                total: { fontSize: "12px" },
                value: { fontSize: "16px" }
              }
            }
          }
        }
      }
    }]
  }

  const lineOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
      zoom: { enabled: false }
    },
    colors: ["#10B981"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: { fontSize: "12px", fontWeight: 500 }
      }
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", fontWeight: 500 },
        formatter: (value) => new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact"
        }).format(value)
      }
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4
    },
    tooltip: {
      style: { fontSize: "12px" },
      y: {
        formatter: (value) => new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(value)
      }
    },
    markers: {
      size: 4,
      colors: ["#10B981"],
      strokeWidth: 2,
      strokeColors: "#fff",
      hover: { size: 6 }
    }
  }

  const options = type === "pie" ? pieOptions : lineOptions
  const series = type === "pie" ? chartData.amounts : [{ name: "Spending", data: chartData.amounts }]

  if (chartData.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{type === "pie" ? "Spending Breakdown" : "Spending Trends"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg font-medium">No expense data available</p>
            <p className="text-sm">Start adding expenses to see your spending breakdown</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "pie" ? "Spending Breakdown" : "Spending Trends"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Chart
            options={options}
            series={series}
            type={type}
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SpendingChart