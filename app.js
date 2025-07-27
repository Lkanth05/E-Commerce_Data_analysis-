// E-commerce Analytics Dashboard JavaScript

// Data from the provided JSON
const dashboardData = {
  kpis: {
    total_events: 100000,
    total_users: 10000,
    total_revenue: 4711229.40,
    avg_order_value: 479.32,
    conversion_rate: 16.20
  },
  event_distribution: [
    {"event_type": "View", "count": 70110, "percentage": 70.11},
    {"event_type": "Cart", "count": 15003, "percentage": 15.00},
    {"event_type": "Purchase", "count": 9829, "percentage": 9.83},
    {"event_type": "Remove from Cart", "count": 5058, "percentage": 5.06}
  ],
  top_categories: [
    {"category": "Electronics Tablet", "revenue": 777485.58},
    {"category": "Electronics Laptop", "revenue": 653125.55},
    {"category": "Appliances Home", "revenue": 633099.11},
    {"category": "Electronics Smartphone", "revenue": 620218.74},
    {"category": "Appliances Kitchen", "revenue": 547833.26},
    {"category": "Home Furniture", "revenue": 218413.91},
    {"category": "Sports Equipment", "revenue": 214323.55},
    {"category": "Books Fiction", "revenue": 201665.42},
    {"category": "Beauty Cosmetics", "revenue": 199891.00},
    {"category": "Home Decor", "revenue": 199552.99}
  ],
  conversion_funnel: [
    {"stage": "Sessions with Views", "count": 59169, "percentage": 75.29},
    {"stage": "Sessions with Cart", "count": 14396, "percentage": 18.32},
    {"stage": "Sessions with Purchase", "count": 9588, "percentage": 12.20}
  ],
  model_performance: [
    {"model": "Random Forest", "train_accuracy": 1.000, "test_accuracy": 0.800},
    {"model": "Logistic Regression", "train_accuracy": 0.851, "test_accuracy": 0.846}
  ],
  feature_importance: [
    {"feature": "View Count", "importance": 0.172},
    {"feature": "Average Price", "importance": 0.142},
    {"feature": "Price Std", "importance": 0.142},
    {"feature": "Max Price", "importance": 0.139},
    {"feature": "Total Events", "importance": 0.111},
    {"feature": "Cart Count", "importance": 0.110},
    {"feature": "Branded Events", "importance": 0.067},
    {"feature": "Sessions", "importance": 0.059},
    {"feature": "Categories Viewed", "importance": 0.058}
  ],
  hourly_activity: [
    {"hour": 0, "events": 4221}, {"hour": 1, "events": 4089}, {"hour": 2, "events": 4156}, {"hour": 3, "events": 4093},
    {"hour": 4, "events": 4285}, {"hour": 5, "events": 4088}, {"hour": 6, "events": 4003}, {"hour": 7, "events": 4332},
    {"hour": 8, "events": 4114}, {"hour": 9, "events": 4011}, {"hour": 10, "events": 4172}, {"hour": 11, "events": 4298},
    {"hour": 12, "events": 4174}, {"hour": 13, "events": 4086}, {"hour": 14, "events": 4147}, {"hour": 15, "events": 4159},
    {"hour": 16, "events": 4153}, {"hour": 17, "events": 4166}, {"hour": 18, "events": 4292}, {"hour": 19, "events": 4058},
    {"hour": 20, "events": 4071}, {"hour": 21, "events": 4205}, {"hour": 22, "events": 4199}, {"hour": 23, "events": 4108}
  ]
};

// Chart colors from design system
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Global chart instances
let charts = {};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are ready
    setTimeout(() => {
        initializeNavigation();
        initializeCharts();
    }, 100);
});

// Navigation functionality - Fixed
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    console.log('Navigation buttons found:', navButtons.length);
    console.log('Sections found:', sections.length);

    navButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            console.log('Button clicked:', targetSection);
            
            // Remove active class from all nav buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                console.log('Section activated:', targetSection);
                
                // Refresh charts when section becomes visible
                setTimeout(() => {
                    refreshChartsInSection(targetSection);
                }, 50);
            } else {
                console.error('Target section not found:', targetSection);
            }
        });
    });
}

// Refresh charts when sections become visible
function refreshChartsInSection(sectionId) {
    Object.values(charts).forEach(chart => {
        if (chart && chart.canvas && chart.canvas.offsetParent !== null) {
            chart.resize();
        }
    });
}

// Initialize all charts
function initializeCharts() {
    createEventDistributionChart();
    createCategoryRevenueChart();
    createConversionFunnelChart();
    createHourlyActivityChart();
    createCustomerSegmentChart();
    createModelPerformanceChart();
    createFeatureImportanceChart();
}

// Event Distribution Donut Chart - Fixed tooltips
function createEventDistributionChart() {
    const ctx = document.getElementById('eventDistributionChart');
    if (!ctx) return;
    
    charts.eventDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dashboardData.event_distribution.map(item => item.event_type),
            datasets: [{
                data: dashboardData.event_distribution.map(item => item.count),
                backgroundColor: chartColors.slice(0, 4),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const percentage = dashboardData.event_distribution[context.dataIndex].percentage;
                            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Top Categories Revenue Bar Chart - Fixed tooltips
function createCategoryRevenueChart() {
    const ctx = document.getElementById('categoryRevenueChart');
    if (!ctx) return;
    
    charts.categoryRevenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.top_categories.map(item => item.category.replace(' ', '\n')),
            datasets: [{
                label: 'Revenue ($)',
                data: dashboardData.top_categories.map(item => item.revenue),
                backgroundColor: chartColors[0],
                borderColor: chartColors[0],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `Revenue: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 10,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// Conversion Funnel Chart
function createConversionFunnelChart() {
    const ctx = document.getElementById('conversionFunnelChart');
    if (!ctx) return;
    
    charts.conversionFunnel = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.conversion_funnel.map(item => item.stage),
            datasets: [{
                label: 'Sessions',
                data: dashboardData.conversion_funnel.map(item => item.count),
                backgroundColor: [chartColors[0], chartColors[1], chartColors[2]],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            const percentage = dashboardData.conversion_funnel[context.dataIndex].percentage;
                            return `${context.parsed.x.toLocaleString()} sessions (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// Hourly Activity Pattern Line Chart
function createHourlyActivityChart() {
    const ctx = document.getElementById('hourlyActivityChart');
    if (!ctx) return;
    
    charts.hourlyActivity = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dashboardData.hourly_activity.map(item => item.hour + ':00'),
            datasets: [{
                label: 'Events',
                data: dashboardData.hourly_activity.map(item => item.events),
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toLocaleString()} events`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000).toFixed(1) + 'K';
                        }
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 12
                    }
                }
            }
        }
    });
}

// Customer Segment Distribution Pie Chart
function createCustomerSegmentChart() {
    const ctx = document.getElementById('customerSegmentChart');
    if (!ctx) return;
    
    // Enhanced segment data with 4 segments
    const segmentData = [
        { segment: 'High-Value Buyers', size: 1500, percentage: 15 },
        { segment: 'Active Shoppers', size: 6034, percentage: 60.34 },
        { segment: 'Browsers', size: 1500, percentage: 15 },
        { segment: 'Casual Users', size: 966, percentage: 9.66 }
    ];
    
    charts.customerSegment = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: segmentData.map(item => item.segment),
            datasets: [{
                data: segmentData.map(item => item.size),
                backgroundColor: chartColors.slice(0, 4),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            const percentage = segmentData[context.dataIndex].percentage;
                            return `${context.label}: ${context.parsed.toLocaleString()} users (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Model Performance Comparison Chart
function createModelPerformanceChart() {
    const ctx = document.getElementById('modelPerformanceChart');
    if (!ctx) return;
    
    charts.modelPerformance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.model_performance.map(item => item.model),
            datasets: [
                {
                    label: 'Training Accuracy',
                    data: dashboardData.model_performance.map(item => item.train_accuracy * 100),
                    backgroundColor: chartColors[0],
                    borderWidth: 1
                },
                {
                    label: 'Test Accuracy',
                    data: dashboardData.model_performance.map(item => item.test_accuracy * 100),
                    backgroundColor: chartColors[1],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Feature Importance Chart
function createFeatureImportanceChart() {
    const ctx = document.getElementById('featureImportanceChart');
    if (!ctx) return;
    
    charts.featureImportance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.feature_importance.map(item => item.feature),
            datasets: [{
                label: 'Importance',
                data: dashboardData.feature_importance.map(item => item.importance * 100),
                backgroundColor: chartColors[2],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `Importance: ${context.parsed.x.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Handle window resize for chart responsiveness
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
});
