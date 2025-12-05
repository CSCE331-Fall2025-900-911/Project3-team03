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

// INVENTORY MANAGEMENT
let editingInventoryId = null;

async function loadInventory() {
    try {
        const data = await getJSON('/api/inventory'); // [{id, item, quantity, price}]
        const tbody = document.querySelector('#inventory-table tbody');

        if (!tbody) return;

        fillTable(tbody, data, (r) => {
            const item = String(r.item ?? '');
            const quantity = r.quantity ?? 0;
            const price = Number(r.price ?? 0).toFixed(2);

            return `<tr>
                <td>${item}</td>
                <td>${quantity}</td>
                <td>$${price}</td>
                <td>
                    <button class="button edit-inventory-btn" style="padding: 4px 8px; font-size: 12px;"
                        data-id="${r.id}"
                        data-item="${item.replace(/"/g, '&quot;')}"
                        data-quantity="${quantity}"
                        data-price="${price}">Edit</button>
                    <button class="button delete-inventory-btn" style="padding: 4px 8px; font-size: 12px; background-color: #ef4444;"
                        data-id="${r.id}"
                        data-item="${item.replace(/"/g, '&quot;')}">Delete</button>
                </td>
             </tr>`;
        });
    } catch (e) {
        console.error('Inventory load failed', e);
    }
}

// Initial load if inventory tab is active
if (document.querySelector('.tab-btn[data-tab="inventory"]')?.classList.contains('active')) {
    loadInventory();
}

// Tab click listener update to load inventory
document.querySelector('.tab-btn[data-tab="inventory"]')?.addEventListener('click', loadInventory);

// Inventory Form Submission
document.getElementById('inventory-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('inventory-id').value;
    const item = document.getElementById('inventory-item').value;
    const quantity = document.getElementById('inventory-quantity').value;
    const price = document.getElementById('inventory-price').value;

    try {
        const url = '/api/inventory';
        // Note: The existing API uses PUT /api/inventory for updates and POST /api/inventory for creates.
        // PUT expects {id, quantity}, POST expects {item, quantity, price}.
        // The current PUT implementation in inventory.js only updates quantity.
        // If we want to update other fields, we'd need to update the backend.
        // For now, we will stick to the existing API contract.

        const method = id ? 'PUT' : 'POST';
        const body = id ? { id, quantity } : { item, quantity, price };

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Reset form
        resetInventoryForm();

        // Reload inventory
        await loadInventory();
    } catch (e) {
        console.error('Inventory save failed', e);
        alert('Failed to save inventory item: ' + e.message);
    }
});

// Edit/Delete Inventory Button Click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-inventory-btn')) {
        const btn = e.target;
        const id = btn.dataset.id;
        const item = btn.dataset.item;
        const quantity = btn.dataset.quantity;
        const price = btn.dataset.price;

        editInventory(id, item, quantity, price);
    } else if (e.target.classList.contains('delete-inventory-btn')) {
        const btn = e.target;
        const id = btn.dataset.id;
        const item = btn.dataset.item;

        if (confirm(`Are you sure you want to delete "${item}"?`)) {
            deleteInventory(id);
        }
    }
});

async function deleteInventory(id) {
    try {
        const response = await fetch('/api/inventory', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Reload inventory
        await loadInventory();
    } catch (e) {
        console.error('Inventory delete failed', e);
        alert('Failed to delete inventory item: ' + e.message);
    }
}

function editInventory(id, item, quantity, price) {
    document.getElementById('inventory-id').value = id;
    document.getElementById('inventory-item').value = item;
    document.getElementById('inventory-quantity').value = quantity;
    document.getElementById('inventory-price').value = price;

    // Disable item and price fields for edit if backend only supports quantity update
    // Based on src/routes/inventory.js, PUT only takes id and quantity.
    // So we should probably disable item and price editing or warn the user.
    // For better UX, let's disable them visually or just know they won't update.
    // Actually, let's disable them to be clear.
    document.getElementById('inventory-item').disabled = true;
    document.getElementById('inventory-price').disabled = true;

    document.getElementById('inventory-submit-btn').textContent = 'Update Quantity';
    document.getElementById('inventory-cancel-btn').style.display = 'inline-block';
    editingInventoryId = id;
}

function resetInventoryForm() {
    document.getElementById('inventory-form').reset();
    document.getElementById('inventory-id').value = '';
    document.getElementById('inventory-item').disabled = false;
    document.getElementById('inventory-price').disabled = false;
    document.getElementById('inventory-submit-btn').textContent = 'Add Item';
    document.getElementById('inventory-cancel-btn').style.display = 'none';
    editingInventoryId = null;
}

document.getElementById('inventory-cancel-btn')?.addEventListener('click', resetInventoryForm);

// WEEKLY INVENTORY
const loadWeekBtn = document.getElementById('load-week');

if (loadWeekBtn) {
    loadWeekBtn.addEventListener('click', async () => {
        const weekInput = document.getElementById('weekNumber');
        const week = (weekInput && weekInput.value) || 1;

        try {
            const data = await getJSON('/api/weeklyInventory/' + week);
            const tbody = document.querySelector('#weekly-table tbody');
            if (!tbody) return;

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
}

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

// Reports Tab
document.addEventListener('DOMContentLoaded', () => {
    const reportsTableBody = document.querySelector('#reports-table tbody');
    const detailTitle = document.getElementById('report-detail-title');
    const detailContent = document.getElementById('report-detail-content');

    const createForm = document.getElementById('report-create-form');
    const createNameInput = document.getElementById('create-report-name');
    const createCreatedByInput = document.getElementById('create-report-created-by');
    const createContentInput = document.getElementById('create-report-content');

    if (!reportsTableBody) return;

    let currentReport = null;
    let currentRow = null;
    let reportsCache = [];

    loadReports();

    async function loadEmployeeId() {
        const jwtInfo = await (
            await fetch('/api/jwt', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getCookie('authToken')}`,
                },
            })
        ).json();

        return jwtInfo.employeeId;
    }

    async function loadReports() {
        try {
            const res = await fetch('/api/reports');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const reports = await res.json();
            reportsCache = reports;
            createCreatedByInput.value = await loadEmployeeId();
            renderReports(reports);
        } catch (err) {
            console.error('Error loading reports:', err);
            reportsTableBody.innerHTML = `
                <tr><td colspan="2" style="color:#b91c1c;">Failed to load reports.</td></tr>
            `;
        }
    }

    function renderReports(reports) {
        if (!Array.isArray(reports) || reports.length === 0) {
            reportsTableBody.innerHTML = `<tr><td colspan="2" style="color:#6b7280;">No reports found.</td></tr>`;
            return;
        }

        reportsTableBody.innerHTML = '';
        currentReport = null;
        currentRow = null;

        reports.forEach((r) => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';

            tr.innerHTML = `
                <td>${r.name}</td>
                <td>${r.created_by}</td>
            `;

            tr.addEventListener('click', () => {
                currentReport = r;
                currentRow = tr;
                showReportDetails(r);
                highlightSelected(tr);
            });

            reportsTableBody.appendChild(tr);
        });
    }

    function showReportDetails(report) {
        detailTitle.textContent = report.name;
        detailContent.textContent = report.content || '';
    }

    function highlightSelected(selectedRow) {
        reportsTableBody
            .querySelectorAll('tr')
            .forEach((row) => row.classList.remove('selected-report-row'));
        selectedRow.classList.add('selected-report-row');
    }

    // Create Report
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = createNameInput.value.trim();
            const createdByStr = createCreatedByInput.value.trim();
            const content = createContentInput.value;

            if (!name || !createdByStr || !content) {
                alert('Please fill out all fields.');
                return;
            }

            const created_by = Number(createdByStr);
            if (Number.isNaN(created_by)) {
                alert('Created By must be a number (employee ID).');
                return;
            }

            try {
                const res = await fetch('/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        created_by,
                        content,
                    }),
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error('Create failed', res.status, text);
                    throw new Error(`HTTP ${res.status}: ${text}`);
                }

                const newReport = await res.json();

                reportsCache.unshift(newReport);
                renderReports(reportsCache);

                currentReport = newReport;

                const firstRow = reportsTableBody.querySelector('tr');
                if (firstRow) {
                    highlightSelected(firstRow);
                }
                showReportDetails(newReport);

                createForm.reset();

                alert('Report created successfully.');
            } catch (err) {
                console.error('Failed to create report:', err);
                alert('Failed to create report: ' + err.message);
            }
        });
    }

    // X-Report
    const xReportForm = document.getElementById('xreport-form');
    const xReportDateInput = document.getElementById('xreport-date');

    if (xReportForm && xReportDateInput) {
        xReportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dateStr = xReportDateInput.value;
            if (!dateStr) {
                alert('Please pick a date for the X-Report.');
                return;
            }

            try {
                const created_by = await loadEmployeeId();

                const res = await fetch('/api/xreport', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: dateStr,
                        created_by,
                    }),
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error('X-Report creation failed', res.status, text);
                    throw new Error(`HTTP ${res.status}: ${text}`);
                }

                const payload = await res.json();
                const newReport = payload.report;

                reportsCache.unshift(newReport);
                renderReports(reportsCache);

                currentReport = newReport;
                const firstRow = reportsTableBody.querySelector('tr');
                if (firstRow) {
                    highlightSelected(firstRow);
                }
                showReportDetails(newReport);

                xReportForm.reset();

                alert('X-Report created successfully.');
            } catch (err) {
                console.error('Failed to create X-Report:', err);
                alert('Failed to create X-Report: ' + err.message);
            }
        });
    }
});

function getCookie(name) {
    return document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
        ?.split('=')[1];
}
