// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Helpers
async function getJSON(url){ const r = await fetch(url); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }
function fillTable(tbody, rows, render){
  tbody.innerHTML = rows.map(render).join('');
}

// SALES
(async function loadSales(){
  try{
    const data = await getJSON('/api/sales'); // [{drink_id, sales}]
    const tbody = document.querySelector('#sales-table tbody');
    fillTable(tbody, data, r => `<tr><td>${r.drink_id}</td><td>${r.sales}</td></tr>`);
    const labels = data.map(r => r.drink_id);
    const values = data.map(r => Number(r.sales));
    new Chart(document.getElementById('sales-chart').getContext('2d'), {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Sales', data: values }] },
      options: {responsive:true, maintainAspectRatio:false}
    });
  }catch(e){ console.error('Sales load failed', e); }
})();

// PROFIT
(async function loadProfit(){
  try{
    const data = await getJSON('/api/profit'); // [{drink_id, revenue, total_order}]
    const tbody = document.querySelector('#profit-table tbody');
    fillTable(tbody, data, r => `<tr><td>${r.drink_id}</td><td>$${Number(r.revenue).toFixed(2)}</td><td>${r.total_order}</td></tr>`);
    const labels = data.map(r => r.drink_id);
    const values = data.map(r => Number(r.revenue));
    new Chart(document.getElementById('profit-chart').getContext('2d'), {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Avg Weekly Revenue', data: values }] },
      options: {responsive:true, maintainAspectRatio:false}
    });
  }catch(e){ console.error('Profit load failed', e); }
})();

// INVENTORY SUMMARY
(async function loadInventory(){
  try{
    const data = await getJSON('/api/inventory'); // expect rows with category & item_count
    const tbody = document.querySelector('#inventory-table tbody');
    fillTable(tbody, data, r => `<tr><td>${r.category}</td><td>${r.item_count}</td></tr>`);
  }catch(e){ console.error('Inventory load failed', e); }
})();

// WEEKLY INVENTORY
document.getElementById('load-week').addEventListener('click', async () => {
  const week = document.getElementById('weekNumber').value || 1;
  try{
    const data = await getJSON('/api/weeklyInventory/' + week); // array of {week_date,item,previous_qty,current_qty}
    const tbody = document.querySelector('#weekly-table tbody');
    fillTable(tbody, data, r => `<tr><td>${r.week_date ?? ''}</td><td>${r.item ?? ''}</td><td>${r.previous_qty ?? ''}</td><td>${r.current_qty ?? ''}</td></tr>`);
  }catch(e){ console.error('Weekly inventory load failed', e); }
});

