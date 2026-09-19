const STORAGE_KEY = "kakeibo-items";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kakeibo-form");
  const tableBody = document.getElementById("kakeibo-body");
  const totalAmount = document.getElementById("total-amount");

  if (!form || !tableBody || !totalAmount) {
    return;
  }

  const readItems = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error("データの読み込みに失敗しました:", error);
      return [];
    }
  };

  const writeItems = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const renderItems = () => {
    const items = readItems();
    tableBody.innerHTML = "";

    let total = 0;

    items.forEach((item) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = item.date || "";

      const typeCell = document.createElement("td");
      typeCell.textContent = item.type || "";

      const categoryCell = document.createElement("td");
      categoryCell.textContent = item.category || "";

      const amountCell = document.createElement("td");
      const amountValue = Number(item.amount || 0);
      amountCell.textContent = `${amountValue.toLocaleString()}円`;

      if (item.type === "収入") {
        total += amountValue;
      } else if (item.type === "支出") {
        total -= amountValue;
      }

      row.appendChild(dateCell);
      row.appendChild(typeCell);
      row.appendChild(categoryCell);
      row.appendChild(amountCell);
      tableBody.appendChild(row);
    });

    totalAmount.textContent = total >= 0 ? `${total.toLocaleString()}円` : `-${Math.abs(total).toLocaleString()}円`;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const dateInput = document.getElementById("date");
    const typeInput = document.getElementById("type");
    const categoryInput = document.getElementById("category");
    const amountInput = document.getElementById("amount");

    if (!dateInput || !typeInput || !categoryInput || !amountInput) {
      return;
    }

    const date = dateInput.value;
    const type = typeInput.value;
    const category = categoryInput.value.trim();
    const amount = Number(amountInput.value);

    if (!date || !category || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const items = readItems();
    items.push({
      date,
      type,
      category,
      amount,
    });

    writeItems(items);
    form.reset();
    renderItems();
  });

  renderItems();
});
