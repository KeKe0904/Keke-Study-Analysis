document.addEventListener('DOMContentLoaded', function() {
    const subjectList = document.getElementById('subject-list');
    const scoreForm = document.getElementById('score-form');
    const scoreLimitSelect = document.getElementById('score-limit');
    const resetSubjectsBtn = document.getElementById('reset-subjects');
    const examTimeSelect = document.getElementById('exam-time');
    
    // 所有可选科目
    const allSubjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];
    let selectedSubjects = [];
    let subjectScores = {};
    let scoreLimits = {};
    let currentScoreLimitType = 'default';
    let currentExamTime = '';
    
    // 加载已保存的分数限制
    if (localStorage.getItem('scoreLimits')) {
        scoreLimits = JSON.parse(localStorage.getItem('scoreLimits'));
    }
    
    if (localStorage.getItem('currentScoreLimitType')) {
        currentScoreLimitType = localStorage.getItem('currentScoreLimitType');
        if (scoreLimitSelect) {
            scoreLimitSelect.value = currentScoreLimitType;
        }
    }
    
    // 加载已保存的考试时间
    if (localStorage.getItem('currentExamTime')) {
        currentExamTime = localStorage.getItem('currentExamTime');
    }
    
    // 生成考试时间选项
    generateExamTimeOptions();
    
    // 分数限制选择事件
    if (scoreLimitSelect) {
        scoreLimitSelect.addEventListener('change', function() {
            currentScoreLimitType = this.value;
            localStorage.setItem('currentScoreLimitType', currentScoreLimitType);
            
            if (currentScoreLimitType === 'custom-2') {
                // 显示自定义分数弹窗
                showCustomScoreLimitModal();
            } else {
                // 设置预设分数限制
                setPresetScoreLimits(currentScoreLimitType);
                // 重新渲染表单，更新验证规则
                if (selectedSubjects.length > 0) {
                    renderSelectedSubjectsForm();
                }
            }
        });
    }
    
    // 重新选择科目按钮点击事件
    if (resetSubjectsBtn) {
        resetSubjectsBtn.addEventListener('click', function() {
            // 清除已选择的科目和成绩
            selectedSubjects = [];
            subjectScores = {};
            localStorage.removeItem('selectedSubjects');
            localStorage.removeItem('subjectScores');
            
            // 显示科目选择弹窗
            showSubjectSelectionModal();
        });
    }
    
    // 考试时间选择事件
    if (examTimeSelect) {
        examTimeSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue === 'custom') {
                // 显示自定义时间弹窗
                showCustomTimeModal();
            } else {
                // 保存选择的考试时间
                currentExamTime = selectedValue;
                localStorage.setItem('currentExamTime', currentExamTime);
            }
        });
    }
    
    // 生成考试时间选项
    function generateExamTimeOptions() {
        if (!examTimeSelect) return;
        
        // 获取当前日期
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 月份从0开始，所以加1
        const currentDate = now.getDate();
        
        // 确定是上半年还是下半年
        let yearPeriod = '';
        if (currentMonth >= 2 && currentMonth <= 7) {
            yearPeriod = '上半年';
        } else {
            yearPeriod = '下半年';
        }
        
        // 生成选项
        const options = [
            {
                value: `midterm-${currentYear}`,
                label: `${currentYear}${yearPeriod}期中考试`
            },
            {
                value: `final-${currentYear}`,
                label: `${currentYear}${yearPeriod}期末考试`
            },
            {
                value: `opening-${currentYear}`,
                label: `${currentYear}${yearPeriod}开学考试`
            },
            {
                value: `regular-${currentYear}-${currentMonth}-${currentDate}`,
                label: `${currentYear}${yearPeriod}普通测试 ${currentMonth}月${currentDate}日`
            }
        ];
        
        // 如果当前选择的是自定义时间，添加到选项中
        if (currentExamTime && currentExamTime.startsWith('custom-')) {
            const customParts = currentExamTime.split('-');
            if (customParts.length >= 3) {
                const examDate = customParts[1];
                const examDescription = decodeURIComponent(customParts.slice(2).join('-'));
                options.push({
                    value: currentExamTime,
                    label: `${examDescription} (${examDate})`
                });
            }
        }
        
        // 添加自定义时间选项
        options.push({
            value: 'custom',
            label: '自定义时间'
        });
        
        // 清空并添加选项
        examTimeSelect.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            if (option.value === currentExamTime) {
                optionElement.selected = true;
            }
            examTimeSelect.appendChild(optionElement);
        });
    }
    
    // 显示自定义时间弹窗
    function showCustomTimeModal() {
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.5s ease-out;
        `;
        
        // 创建弹窗内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 500px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        // 弹窗标题
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = '自定义考试时间';
        modalTitle.style.cssText = `
            color: #ff6b9d;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        `;
        
        // 输入容器
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 30px;
        `;
        
        // 文字描述输入
        const textInputGroup = document.createElement('div');
        textInputGroup.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;
        
        const textLabel = document.createElement('label');
        textLabel.textContent = '考试描述';
        textLabel.style.cssText = `
            font-weight: bold;
            color: #4a6fa5;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        `;
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = '例如：单元测试、月考等';
        textInput.style.cssText = `
            padding: 10px;
            border: 2px solid rgba(74, 111, 165, 0.3);
            border-radius: 10px;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
        `;
        
        textInputGroup.appendChild(textLabel);
        textInputGroup.appendChild(textInput);
        
        // 日期选择输入
        const dateInputGroup = document.createElement('div');
        dateInputGroup.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;
        
        const dateLabel = document.createElement('label');
        dateLabel.textContent = '考试日期';
        dateLabel.style.cssText = `
            font-weight: bold;
            color: #4a6fa5;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        `;
        
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.required = true;
        dateInput.style.cssText = `
            padding: 10px;
            border: 2px solid rgba(74, 111, 165, 0.3);
            border-radius: 10px;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
            cursor: pointer;
        `;
        
        // 设置默认值为当前日期
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        
        dateInputGroup.appendChild(dateLabel);
        dateInputGroup.appendChild(dateInput);
        
        inputContainer.appendChild(textInputGroup);
        inputContainer.appendChild(dateInputGroup);
        
        // 按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 20px;
        `;
        
        // 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.className = 'btn';
        confirmBtn.addEventListener('click', function() {
            const examDescription = textInput.value.trim();
            const examDate = dateInput.value;
            
            if (!examDescription) {
                alert('请输入考试描述');
                return;
            }
            
            if (!examDate) {
                alert('请选择考试日期');
                return;
            }
            
            // 保存自定义时间
            const customTimeValue = `custom-${examDate}-${encodeURIComponent(examDescription)}`;
            currentExamTime = customTimeValue;
            localStorage.setItem('currentExamTime', currentExamTime);
            
            // 更新选择框
            generateExamTimeOptions();
            examTimeSelect.value = currentExamTime;
            
            // 移除弹窗
            document.body.removeChild(modal);
        });
        
        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.className = 'btn btn-primary';
        cancelBtn.addEventListener('click', function() {
            // 恢复之前的选择
            generateExamTimeOptions();
            if (currentExamTime) {
                examTimeSelect.value = currentExamTime;
            }
            document.body.removeChild(modal);
        });
        
        buttonsContainer.appendChild(confirmBtn);
        buttonsContainer.appendChild(cancelBtn);
        
        // 组装弹窗
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(inputContainer);
        modalContent.appendChild(buttonsContainer);
        modal.appendChild(modalContent);
        
        // 添加到页面
        document.body.appendChild(modal);
    }
    
    // 设置预设分数限制
    function setPresetScoreLimits(type) {
        switch (type) {
            case 'default':
                scoreLimits = {
                    '语文': 150,
                    '数学': 150,
                    '英语': 150,
                    '物理': 100,
                    '化学': 100,
                    '生物': 100,
                    '历史': 100,
                    '地理': 100,
                    '政治': 100
                };
                break;
            case '120-100':
                scoreLimits = {
                    '语文': 120,
                    '数学': 120,
                    '英语': 120,
                    '物理': 100,
                    '化学': 100,
                    '生物': 100,
                    '历史': 100,
                    '地理': 100,
                    '政治': 100
                };
                break;
            case 'custom-1':
                scoreLimits = {
                    '语文': 120,
                    '数学': 120,
                    '英语': 120,
                    '政治': 60,
                    '历史': 50,
                    '物理': 70,
                    '化学': 60,
                    '生物': 40,
                    '地理': 40
                };
                break;
        }
        localStorage.setItem('scoreLimits', JSON.stringify(scoreLimits));
    }
    
    // 显示自定义分数弹窗
    function showCustomScoreLimitModal() {
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.5s ease-out;
        `;
        
        // 创建弹窗内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 600px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        // 弹窗标题
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = '自定义最高分数';
        modalTitle.style.cssText = `
            color: #ff6b9d;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        `;
        
        // 分数输入容器
        const scoresContainer = document.createElement('div');
        scoresContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        `;
        
        // 为每个科目生成分数输入
        allSubjects.forEach(subject => {
            const scoreItem = document.createElement('div');
            scoreItem.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 5px;
            `;
            
            const label = document.createElement('label');
            label.textContent = `${subject}最高分`;
            label.style.cssText = `
                font-weight: bold;
                color: #4a6fa5;
                text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
            `;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = '300';
            input.value = scoreLimits[subject] || 100;
            input.style.cssText = `
                padding: 8px;
                border: 2px solid rgba(74, 111, 165, 0.3);
                border-radius: 10px;
                font-size: 16px;
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(5px);
            `;
            
            input.dataset.subject = subject;
            
            scoreItem.appendChild(label);
            scoreItem.appendChild(input);
            scoresContainer.appendChild(scoreItem);
        });
        
        // 按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 20px;
        `;
        
        // 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.className = 'btn';
        confirmBtn.addEventListener('click', function() {
            // 获取所有分数输入
            const scoreInputs = scoresContainer.querySelectorAll('input[type="number"]');
            scoreInputs.forEach(input => {
                const subject = input.dataset.subject;
                const limit = parseInt(input.value);
                if (!isNaN(limit) && limit > 0) {
                    scoreLimits[subject] = limit;
                }
            });
            
            // 保存分数限制
            localStorage.setItem('scoreLimits', JSON.stringify(scoreLimits));
            
            // 移除弹窗
            document.body.removeChild(modal);
            
            // 重新渲染表单，更新验证规则
            if (selectedSubjects.length > 0) {
                renderSelectedSubjectsForm();
            }
        });
        
        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.className = 'btn btn-primary';
        cancelBtn.addEventListener('click', function() {
            // 恢复之前的选择
            scoreLimitSelect.value = localStorage.getItem('currentScoreLimitType') || 'default';
            document.body.removeChild(modal);
        });
        
        buttonsContainer.appendChild(confirmBtn);
        buttonsContainer.appendChild(cancelBtn);
        
        // 组装弹窗
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(scoresContainer);
        modalContent.appendChild(buttonsContainer);
        modal.appendChild(modalContent);
        
        // 添加到页面
        document.body.appendChild(modal);
    }
    
    // 设置默认分数限制
    if (Object.keys(scoreLimits).length === 0) {
        setPresetScoreLimits('default');
    }
    
    // 检查是否已经选择了科目
    if (localStorage.getItem('selectedSubjects')) {
        selectedSubjects = JSON.parse(localStorage.getItem('selectedSubjects'));
        // 加载已保存的成绩
        if (localStorage.getItem('subjectScores')) {
            subjectScores = JSON.parse(localStorage.getItem('subjectScores'));
        }
        renderSelectedSubjectsForm();
    } else {
        // 显示科目选择弹窗
        showSubjectSelectionModal();
    }
    
    // 显示科目选择弹窗
    function showSubjectSelectionModal() {
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.5s ease-out;
        `;
        
        // 创建弹窗内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 500px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        // 弹窗标题
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = '选择你学习的科目';
        modalTitle.style.cssText = `
            color: #ff6b9d;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        `;
        
        // 科目选择容器
        const subjectsContainer = document.createElement('div');
        subjectsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        `;
        
        // 生成科目选择复选框
        allSubjects.forEach(subject => {
            const subjectItem = document.createElement('div');
            subjectItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
            `;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = subject;
            checkbox.style.marginRight = '10px';
            
            // 默认选择语数外
            if (['语文', '数学', '英语'].includes(subject)) {
                checkbox.checked = true;
                subjectItem.style.background = 'rgba(255, 107, 157, 0.3)';
            }
            
            subjectItem.addEventListener('click', function() {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.style.background = checkbox.checked ? 'rgba(255, 107, 157, 0.3)' : 'rgba(255, 255, 255, 0.7)';
            });
            
            const label = document.createElement('label');
            label.textContent = subject;
            label.style.cursor = 'pointer';
            
            subjectItem.appendChild(checkbox);
            subjectItem.appendChild(label);
            subjectsContainer.appendChild(subjectItem);
        });
        
        // 按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 20px;
        `;
        
        // 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认选择';
        confirmBtn.className = 'btn';
        confirmBtn.addEventListener('click', function() {
            // 获取选中的科目
            const checkboxes = subjectsContainer.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                selectedSubjects.push(checkbox.value);
            });
            
            if (selectedSubjects.length === 0) {
                alert('请至少选择一个科目');
                return;
            }
            
            // 保存选择的科目
            localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
            
            // 移除弹窗
            document.body.removeChild(modal);
            
            // 渲染选择的科目表单
            renderSelectedSubjectsForm();
        });
        
        buttonsContainer.appendChild(confirmBtn);
        
        // 组装弹窗
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(subjectsContainer);
        modalContent.appendChild(buttonsContainer);
        modal.appendChild(modalContent);
        
        // 添加到页面
        document.body.appendChild(modal);
    }
    
    // 渲染选择的科目表单
    function renderSelectedSubjectsForm() {
        // 清空表单
        scoreForm.innerHTML = '';
        
        // 为每个选择的科目生成成绩输入字段
        selectedSubjects.forEach((subject, index) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.style.animationDelay = `${0.5 + index * 0.2}s`;
            
            const label = document.createElement('label');
            label.textContent = `${subject}成绩`;
            label.htmlFor = `score-${subject}`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `score-${subject}`;
            input.name = subject;
            input.placeholder = `填写你的${subject}成绩`;
            input.required = true;
            
            // 清空输入框，每次提交后重新输入
            input.value = '';
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            scoreForm.appendChild(formGroup);
        });
        
        // 添加按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        `;
        
        // 添加分析成绩按钮
        const submitBtn = document.createElement('div');
        submitBtn.className = 'form-group';
        submitBtn.style.marginBottom = '0';
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary';
        submitButton.textContent = '分析成绩';
        
        submitBtn.appendChild(submitButton);
        buttonsContainer.appendChild(submitBtn);
        
        // 添加重新选择科目按钮
        const resetBtn = document.createElement('div');
        resetBtn.className = 'form-group';
        resetBtn.style.marginBottom = '0';
        
        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.className = 'btn';
        resetButton.textContent = '重新选择科目';
        resetButton.addEventListener('click', function() {
            // 清除已选择的科目和成绩
            selectedSubjects = [];
            subjectScores = {};
            localStorage.removeItem('selectedSubjects');
            localStorage.removeItem('subjectScores');
            
            // 显示科目选择弹窗
            showSubjectSelectionModal();
        });
        
        resetBtn.appendChild(resetButton);
        buttonsContainer.appendChild(resetBtn);
        
        scoreForm.appendChild(buttonsContainer);
        
        // 渲染已输入的成绩列表
        renderSubjects();
    }
    
    // 表单提交事件
    scoreForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 收集所有科目的成绩
        selectedSubjects.forEach(subject => {
            const input = document.getElementById(`score-${subject}`);
            const scoreStr = input.value.trim();
            
            if (scoreStr) {
                // 解析单个成绩
                const score = parseFloat(scoreStr);
                const maxScore = scoreLimits[subject] || 100;
                
                if (isNaN(score) || score < 0 || score > maxScore) {
                    alert(`${subject}成绩必须是0-${maxScore}之间的数字`);
                    return;
                }
                
                // 保存为数组形式，支持多次成绩
                if (!subjectScores[subject]) {
                    subjectScores[subject] = [];
                }
                // 添加新成绩到数组
                subjectScores[subject].push(score);
                // 限制最多保存10次成绩
                if (subjectScores[subject].length > 10) {
                    subjectScores[subject] = subjectScores[subject].slice(-10);
                }
            }
        });
        
        // 保存成绩到localStorage
        localStorage.setItem('subjectScores', JSON.stringify(subjectScores));
        
        // 跳转到分析页面
        window.location.href = 'analysis.html';
    });
    
    // 渲染科目列表
    function renderSubjects() {
        subjectList.innerHTML = '';
        
        // 检查是否有输入的成绩
        const hasScores = Object.keys(subjectScores).length > 0;
        
        if (hasScores) {
            Object.entries(subjectScores).forEach(([subject, scores]) => {
                const subjectItem = document.createElement('div');
                subjectItem.className = 'subject-item';
                
                const subjectInfo = document.createElement('div');
                subjectInfo.innerHTML = `
                    <strong>${subject}</strong>: ${scores.join(', ')}
                `;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.textContent = '删除成绩';
                removeBtn.addEventListener('click', function() {
                    delete subjectScores[subject];
                    localStorage.setItem('subjectScores', JSON.stringify(subjectScores));
                    renderSubjects();
                });
                
                subjectItem.appendChild(subjectInfo);
                subjectItem.appendChild(removeBtn);
                subjectList.appendChild(subjectItem);
            });
        } else {
            const noDataMsg = document.createElement('div');
            noDataMsg.style.cssText = `
                text-align: center;
                padding: 20px;
                color: #666;
                font-style: italic;
            `;
            noDataMsg.textContent = '还没有输入成绩';
            subjectList.appendChild(noDataMsg);
        }
    }
});