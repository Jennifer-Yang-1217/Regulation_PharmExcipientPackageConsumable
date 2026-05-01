/**
 * 制药物料管理法规知识库 - 交互逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化搜索和筛选功能
    initSearch();
    initFilters();
});

/**
 * 搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterTable();
    }, 300));
}

let currentMaterialFilter = 'all';
let currentManagementFilter = 'all';

/**
 * 筛选功能
 */
function initFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const filterType = this.dataset.type;
            const filterValue = this.dataset.filter;
            
            // 更新激活状态
            document.querySelectorAll(`.filter-tag[data-type="${filterType}"]`).forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新筛选条件
            if (filterType === 'material') {
                currentMaterialFilter = filterValue;
            } else if (filterType === 'management') {
                currentManagementFilter = filterValue;
            }
            
            filterTable();
        });
    });
}

/**
 * 筛选表格
 */
function filterTable() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    const tbody = document.getElementById('regulationTableBody');
    const noResults = document.getElementById('noResults');
    
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const id = row.dataset.id;
        const nameCell = row.querySelector('.col-name');
        const nameText = nameCell?.textContent.toLowerCase() || '';
        
        // 搜索匹配
        const searchMatch = searchTerm === '' || nameText.includes(searchTerm);
        
        // 获取详情数据（通过链接）
        const detailLink = row.querySelector('.regulation-link');
        const hasDetail = !!detailLink;
        
        // 物料类型筛选 - 基于法规名称关键词
        let materialMatch = true;
        if (currentMaterialFilter !== 'all') {
            if (currentMaterialFilter === '原料' && !nameText.includes('原料') && !nameText.includes('原辅')) {
                materialMatch = false;
            } else if (currentMaterialFilter === '辅料' && !nameText.includes('辅料') && !nameText.includes('原辅')) {
                materialMatch = false;
            } else if (currentMaterialFilter === '包材' && !nameText.includes('包材') && !nameText.includes('药包材') && !nameText.includes('包装')) {
                materialMatch = false;
            } else if (currentMaterialFilter === '耗材') {
                // 耗材关键词
                materialMatch = false;
            }
        }
                
        // 综合判断
        const show = searchMatch && materialMatch;
        row.classList.toggle('hidden', !show);
        
        if (show) visibleCount++;
    });
    
    // 显示/隐藏无结果提示
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 平滑滚动到顶部
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
