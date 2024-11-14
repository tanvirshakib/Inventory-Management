// Import necessary Firestore functions
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Fetch and display items
export async function fetchItems(db) {
    const snapshot = await getDocs(collection(db, "inventory"));
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';

    items.forEach(item => {
        const row = `
            <tr>
                <td contenteditable="true" onblur="editItem('${item.id}', 'Name', this.innerText, db)">${item.Name}</td>
                <td contenteditable="true" onblur="editItem('${item.id}', 'Quantity', this.innerText, db)">${item.Quantity}</td>
                <td contenteditable="true" onblur="editItem('${item.id}', 'Unit', this.innerText, db)">${item.Unit}</td>
                <td contenteditable="true" onblur="editItem('${item.id}', 'StockStatus', this.innerText, db)">${item.StockStatus}</td>
                <td contenteditable="true" onblur="editItem('${item.id}', 'ReorderLevel', this.innerText, db)">${item.ReorderLevel}</td>
                <td><input type="date" value="${item.CanServeTill || ''}" onchange="editItem('${item.id}', 'CanServeTill', this.value, db)"></td>
                <td><button onclick="deleteItem('${item.id}', db)">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Add a new item
export async function addItem(db) {
    const newItem = {
        Name: document.getElementById('name').value,
        Quantity: parseInt(document.getElementById('quantity').value),
        Unit: document.getElementById('unit').value,
        StockStatus: document.getElementById('stockStatus').value,
        ReorderLevel: parseInt(document.getElementById('reorderLevel').value),
        CanServeTill: document.getElementById('canServeTill').value,
    };

    await addDoc(collection(db, "inventory"), newItem);
    fetchItems(db);
    document.getElementById('itemForm').reset();
}

// Edit an item
export async function editItem(id, field, value, db) {
    const itemRef = doc(db, "inventory", id);
    await updateDoc(itemRef, {
        [field]: field === 'Quantity' || field === 'ReorderLevel' ? parseInt(value) || 0 : value
    });
}

// Delete an item
export async function deleteItem(id, db) {
    await deleteDoc(doc(db, "inventory", id));
    fetchItems(db);
}
