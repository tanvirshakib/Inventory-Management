// Google Apps Script Web App URL with your deployment ID
const apiUrl = 'https://script.google.com/macros/s/AKfycbx4-5OOjMHwN2T9DeRmkkrAAE_15qEi03oq2w8b2OgVereonOgwNcEbsuEQExXO7oR-lw/exec';

// Fetch and display all items
async function fetchItems() {
    const response = await fetch(apiUrl);
    const items = await response.json();

    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = ''; // Clear existing content
    
    items.forEach(item => {
        const row = `
            <tr>
                <td contenteditable="true" onblur="editItem(${item.ID}, 'Name', this.innerText)">${item.Name}</td>
                <td contenteditable="true" onblur="editItem(${item.ID}, 'Quantity', this.innerText)">${item.Quantity}</td>
                <td contenteditable="true" onblur="editItem(${item.ID}, 'Unit', this.innerText)">${item.Unit}</td>
                <td contenteditable="true" onblur="editItem(${item.ID}, 'StockStatus', this.innerText)">${item.StockStatus}</td>
                <td contenteditable="true" onblur="editItem(${item.ID}, 'ReorderLevel', this.innerText)">${item.ReorderLevel}</td>
                <td><input type="date" value="${item.CanServeTill}" onchange="editItem(${item.ID}, 'CanServeTill', this.value)"></td>
                <td><button onclick="deleteItem(${item.ID})">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Add a new item
async function addItem() {
    const newItem = {
        Name: document.getElementById('name').value,
        Quantity: parseInt(document.getElementById('quantity').value),
        Unit: document.getElementById('unit').value,
        StockStatus: document.getElementById('stockStatus').value,
        ReorderLevel: parseInt(document.getElementById('reorderLevel').value),
        CanServeTill: document.getElementById('canServeTill').value,
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    });
    fetchItems();
    document.getElementById('itemForm').reset();
}

// Edit an existing item
async function editItem(id, field, value) {
    const updatedItem = { ID: id, [field]: value };
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
    });
}

// Delete an item
async function deleteItem(id) {
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID: id })
    });
    fetchItems();
}

// Initialize table display
fetchItems();
