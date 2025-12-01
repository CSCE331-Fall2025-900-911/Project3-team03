// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');
tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        tabButtons.forEach((b) => b.classList.remove('active'));
        tabs.forEach((t) => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');

        // Load data when specific tabs are clicked
        if (btn.dataset.tab === 'employees') {
            console.log('Employees tab clicked, loading employees...');
            loadEmployees();
        }
    });
});

// Helpers
async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
}
function fillTable(tbody, rows, render) {
    tbody.innerHTML = rows.map(render).join('');
}

// SALES
(async function loadSales() {
    try {
        const data = await getJSON('/api/sales'); // [{drink_id, sales}]
        const tbody = document.querySelector('#sales-table tbody');
        fillTable(tbody, data, (r) => `<tr><td>${r.drink_id}</td><td>${r.sales}</td></tr>`);
        const labels = data.map((r) => r.drink_id);
        const values = data.map((r) => Number(r.sales));
        new Chart(document.getElementById('sales-chart').getContext('2d'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Sales', data: values }] },
            options: { responsive: true, maintainAspectRatio: false },
        });
    } catch (e) {
        console.error('Sales load failed', e);
    }
})();

// PROFIT
(async function loadProfit() {
    try {
        const data = await getJSON('/api/profit'); // [{drink_id, revenue, total_order}]
        const tbody = document.querySelector('#profit-table tbody');
        fillTable(
            tbody,
            data,
            (r) =>
                `<tr><td>${r.drink_id}</td><td>$${Number(r.revenue).toFixed(2)}</td><td>${
                    r.total_order
                }</td></tr>`
        );
        const labels = data.map((r) => r.drink_id);
        const values = data.map((r) => Number(r.revenue));
        new Chart(document.getElementById('profit-chart').getContext('2d'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Avg Weekly Revenue', data: values }] },
            options: { responsive: true, maintainAspectRatio: false },
        });
    } catch (e) {
        console.error('Profit load failed', e);
    }
})();

// INVENTORY SUMMARY
(async function loadInventory() {
    try {
        const data = await getJSON('/api/inventory'); // expect rows with category & item_count
        const tbody = document.querySelector('#inventory-table tbody');
        fillTable(tbody, data, (r) => `<tr><td>${r.category}</td><td>${r.item_count}</td></tr>`);
    } catch (e) {
        console.error('Inventory load failed', e);
    }
})();

// WEEKLY INVENTORY
document.getElementById('load-week').addEventListener('click', async () => {
    const week = document.getElementById('weekNumber').value || 1;
    try {
        const data = await getJSON('/api/weeklyInventory/' + week); // array of {week_date,item,previous_qty,current_qty}
        const tbody = document.querySelector('#weekly-table tbody');
        fillTable(
            tbody,
            data,
            (r) =>
                `<tr><td>${r.week_date ?? ''}</td><td>${r.item ?? ''}</td><td>${
                    r.previous_qty ?? ''
                }</td><td>${r.current_qty ?? ''}</td></tr>`
        );
    } catch (e) {
        console.error('Weekly inventory load failed', e);
    }
});

// EMPLOYEES
let editingEmployeeId = null;

async function loadEmployees() {
    try {
        const tbody = document.querySelector('#employees-table tbody');
        if (!tbody) {
            console.error('Employees table tbody not found');
            return;
        }

        const data = await getJSON('/api/employees'); // [{id, employee_name, permissions, gender}]
        console.log('Loaded employees:', data);

        if (!data || !Array.isArray(data)) {
            console.error('Invalid employees data:', data);
            return;
        }

        fillTable(tbody, data, (r) => {
            const name = String(r.employee_name ?? '');
            const permissions = String(r.permissions ?? '');
            const gender = String(r.gender ?? '');
            const email = String(r.email ?? '');
            return `<tr>
                    <td>${r.id}</td>
                    <td>${name}</td>
                    <td>${permissions}</td>
                    <td>${gender}</td>
                    <td>${email}</td>
                    <td>
                        <button class="button edit-employee-btn" style="padding: 4px 8px; font-size: 12px;" 
                                data-id="${r.id}" 
                                data-name="${name.replace(/"/g, '&quot;')}" 
                                data-permissions="${permissions.replace(/"/g, '&quot;')}" 
                                data-gender="${gender.replace(/"/g, '&quot;')}"
                                data-email="${email.replace(/"/g, '&quot;')}">Edit</button>
                    </td>
                </tr>`;
        });
    } catch (e) {
        console.error('Employees load failed', e);
        const tbody = document.querySelector('#employees-table tbody');
        if (tbody) {
            tbody.innerHTML =
                '<tr><td colspan="6" style="text-align: center; color: red;">Error loading employees. Check console for details.</td></tr>';
        }
    }
}

// Event delegation for edit buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-employee-btn')) {
        const btn = e.target;
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const permissions = btn.dataset.permissions;
        const gender = btn.dataset.gender;
        const email = btn.dataset.email;
        editEmployee(id, name, permissions, gender, email);
    }
});

// Load employees on initial page load if employees tab is active
if (document.querySelector('.tab-btn[data-tab="employees"]')?.classList.contains('active')) {
    loadEmployees();
}

// Employee form submission
document.getElementById('employee-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('employee-id').value;
    const name = document.getElementById('employee-name').value;
    const permissions = document.getElementById('employee-permissions').value;
    const gender = document.getElementById('employee-gender').value;
    const email = document.getElementById('employee-email').value;

    try {
        const url = id ? `/api/employees/${id}` : '/api/employees';
        const method = id ? 'PUT' : 'POST';

        console.log('Sending:', { name, permissions, gender, email });
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, permissions, gender, email }),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to save employee';
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        // Reset form
        document.getElementById('employee-form').reset();
        document.getElementById('employee-id').value = '';
        document.getElementById('submit-btn').textContent = 'Add Employee';
        document.getElementById('cancel-btn').style.display = 'none';
        editingEmployeeId = null;

        // Reload employees
        await loadEmployees();
    } catch (e) {
        console.error('Employee save failed', e);
        alert('Failed to save employee: ' + e.message);
    }
});

// Edit employee function
function editEmployee(id, name, permissions, gender, email) {
    document.getElementById('employee-id').value = id;
    document.getElementById('employee-name').value = name;
    document.getElementById('employee-permissions').value = permissions;
    document.getElementById('employee-gender').value = gender;
    document.getElementById('employee-email').value = email;
    document.getElementById('submit-btn').textContent = 'Update Employee';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    editingEmployeeId = id;
}

// Cancel edit
document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('employee-form').reset();
    document.getElementById('employee-id').value = '';
    document.getElementById('submit-btn').textContent = 'Add Employee';
    document.getElementById('cancel-btn').style.display = 'none';
    editingEmployeeId = null;
});
