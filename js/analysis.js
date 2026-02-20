document.addEventListener('DOMContentLoaded', function() {
    const analysisResults = document.getElementById('analysis-results');
    const chartsContainer = document.querySelector('.charts-container');
    
    // 从localStorage中加载数据
    const subjectScores = JSON.parse(localStorage.getItem('subjectScores') || '{}');
    
    // 转换数据格式
    const subjects = Object.entries(subjectScores).map(([name, scores]) => ({
        name: name,
        scores: scores
    }));
    
    if (subjects.length === 0) {
        // 没有数据，显示提示信息
        return;
    }
    
    // 清空默认提示
    analysisResults.innerHTML = '';
    chartsContainer.innerHTML = '';
    
    // 计算分析结果
    const analysisData = subjects.map(subject => {
        const scores = subject.scores;
        const total = scores.reduce((sum, score) => sum + score, 0);
        const average = total / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        const sortedScores = [...scores].sort((a, b) => a - b);
        
        // 计算中位数
        let median;
        const mid = Math.floor(sortedScores.length / 2);
        if (sortedScores.length % 2 === 0) {
            median = (sortedScores[mid - 1] + sortedScores[mid]) / 2;
        } else {
            median = sortedScores[mid];
        }
        
        // 计算成绩分布
        const distribution = {
            excellent: scores.filter(s => s >= 90).length,
            good: scores.filter(s => s >= 80 && s < 90).length,
            average: scores.filter(s => s >= 60 && s < 80).length,
            poor: scores.filter(s => s < 60).length
        };
        
        return {
            name: subject.name,
            scores: scores,
            total: total,
            average: average,
            highest: highest,
            lowest: lowest,
            median: median,
            distribution: distribution
        };
    });
    
    // 渲染分析结果
    analysisData.forEach(data => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        resultItem.innerHTML = `
            <h3>${data.name}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${data.highest.toFixed(1)}</div>
                    <div class="stat-label">最高分</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.lowest.toFixed(1)}</div>
                    <div class="stat-label">最低分</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.average.toFixed(1)}</div>
                    <div class="stat-label">平均分</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.median.toFixed(1)}</div>
                    <div class="stat-label">中位数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.total.toFixed(1)}</div>
                    <div class="stat-label">总分</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.scores.length}</div>
                    <div class="stat-label">本地保存成绩次数</div>
                </div>
            </div>
        `;
        
        analysisResults.appendChild(resultItem);
    });
    
    // 生成图表
    generateCharts(analysisData);
});

// 生成图表
function generateCharts(analysisData) {
    const chartsContainer = document.querySelector('.charts-container');
    
    // 1. 各科目平均分对比（柱状图）
    const averageChartItem = document.createElement('div');
    averageChartItem.className = 'chart-item';
    averageChartItem.innerHTML = `
        <h3>各科目平均分对比</h3>
        <div class="chart-container">
            <canvas id="averageChart"></canvas>
        </div>
    `;
    chartsContainer.appendChild(averageChartItem);
    
    const averageCtx = document.getElementById('averageChart').getContext('2d');
    new Chart(averageCtx, {
        type: 'bar',
        data: {
            labels: analysisData.map(data => data.name),
            datasets: [{
                label: '平均分',
                data: analysisData.map(data => data.average),
                backgroundColor: 'rgba(74, 111, 165, 0.6)',
                borderColor: 'rgba(74, 111, 165, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...analysisData.map(d => d.average)) * 1.2
                }
            }
        }
    });
    
    // 2. 各科目成绩趋势分析（折线图）
    if (analysisData.length > 0) {
        const trendChartItem = document.createElement('div');
        trendChartItem.className = 'chart-item';
        trendChartItem.innerHTML = `
            <h3>各科目成绩趋势分析</h3>
            <div class="chart-container">
                <canvas id="trendChart"></canvas>
            </div>
        `;
        chartsContainer.appendChild(trendChartItem);
        
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        
        const trendData = {
            labels: analysisData.map(data => data.name),
            datasets: [
                {
                    label: '最高分数',
                    data: analysisData.map(data => data.highest),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                },
                {
                    label: '平均分数',
                    data: analysisData.map(data => data.average),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1
                },
                {
                    label: '最低分数',
                    data: analysisData.map(data => data.lowest),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                }
            ]
        };
        
        new Chart(trendCtx, {
            type: 'line',
            data: trendData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(...analysisData.map(d => d.highest)) * 1.2
                    }
                }
            }
        });
    }
    
    // 3. 每个科目的成绩变化趋势（折线图）
    analysisData.forEach((data, index) => {
        if (data.scores.length > 1) {
            const scoreTrendChartItem = document.createElement('div');
            scoreTrendChartItem.className = 'chart-item';
            scoreTrendChartItem.innerHTML = `
                <h3>${data.name}成绩变化趋势</h3>
                <div class="chart-container">
                    <canvas id="scoreTrendChart${index}"></canvas>
                </div>
            `;
            chartsContainer.appendChild(scoreTrendChartItem);
            
            const scoreTrendCtx = document.getElementById(`scoreTrendChart${index}`).getContext('2d');
            
            // 生成考试次数标签
            const examLabels = [];
            for (let i = 1; i <= data.scores.length; i++) {
                examLabels.push(`第${i}次`);
            }
            
            new Chart(scoreTrendCtx, {
                type: 'line',
                data: {
                    labels: examLabels,
                    datasets: [{
                        label: `${data.name}成绩`,
                        data: data.scores,
                        borderColor: 'rgba(255, 107, 157, 1)',
                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(255, 107, 157, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: Math.max(...data.scores) * 1.2
                        }
                    },
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }
    });
    
    // 4. 各科目成绩分布（雷达图）
    if (analysisData.length > 0) {
        const distributionChartItem = document.createElement('div');
        distributionChartItem.className = 'chart-item';
        distributionChartItem.innerHTML = `
            <h3>成绩分布对比</h3>
            <div class="chart-container">
                <canvas id="distributionChart"></canvas>
            </div>
        `;
        chartsContainer.appendChild(distributionChartItem);
        
        const distributionCtx = document.getElementById('distributionChart').getContext('2d');
        
        const distributionData = {
            labels: ['优秀率', '良好率', '中等率', '不及格率'],
            datasets: analysisData.map((data, index) => {
                const total = data.scores.length;
                const colors = [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ];
                
                return {
                    label: data.name,
                    data: [
                        data.distribution.excellent / total * 100,
                        data.distribution.good / total * 100,
                        data.distribution.average / total * 100,
                        data.distribution.poor / total * 100
                    ],
                    backgroundColor: colors[index % colors.length],
                    borderColor: colors[index % colors.length].replace('0.6', '1'),
                    borderWidth: 1
                };
            })
        };
        
        new Chart(distributionCtx, {
            type: 'radar',
            data: distributionData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}