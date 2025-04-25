const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'https://api.dak.edu.vn/api_rau/vegetables.php';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// GET rau củ theo trang
async function getVegetables(page = 1) {
  try {
    const res = await axios.get(`${BASE_URL}?page=${page}&limit=5`);
    const { data, page: currentPage, pages, total } = res.data;

    console.log(`Danh sách rau - Trang ${currentPage}/${pages} (Tổng: ${total})`);
    data.forEach(item => {
      console.log(`- ID: ${item.id} | Tên: ${item.name} | Giá: ${item.price} | Nhóm: ${item.group}`);
    });
  } catch (err) {
    console.error("Không thể lấy dữ liệu:", err.message);
  }
}

// POST Thêm rau củ
async function addVegetable() {
  const newVeg = {
    name: "Rau siêu nhiều dầu",
    scientific_name: "chắc là rau",
    price: 25000,
    family: "không biết nữa",
    description: "yumyum",
    benefits: "Ngon",
    image: "",
    group: "Thực vật"
  };

  try {
    const res = await axios.post(BASE_URL, newVeg, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Thêm thành công:", res.data);
  } catch (err) {
    console.error("Lỗi thêm rau:", err.message);
  }
}

// PUT Cập nhật rau củ theo ID
async function updateVegetable(id, price, description) {
  if (!id || !price || !description) {
    return console.log("⚠️ Thiếu dữ liệu update");
  }

  try {
    const res = await axios.put(`${BASE_URL}?id=${id}`, { price, description }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Cập nhật thành công:", res.data);
  } catch (err) {
    console.error("Lỗi cập nhật:", err.message);
  }
}

// DELETE Xoá rau củ theo ID
async function deleteVegetable(id) {
  if (!id) return console.log("Vui lòng nhập ID");

  try {
    const res = await axios.delete(`${BASE_URL}?id=${id}`);
    console.log("Đã xoá:", res.data);
  } catch (err) {
    console.error("Lỗi xoá rau:", err.message);
  }
}

// CLI Menu điều khiển
rl.question('Chọn thao tác (1: GET, 2: POST, 3: PUT, 4: DELETE): ', async (option) => {
  switch (option.trim()) {
    case '1':
      rl.question('Trang số: ', async (page) => {
        await getVegetables(page);
        rl.close();
      });
      break;
    case '2':
      await addVegetable();
      rl.close();
      break;
    case '3':
      rl.question('ID cần cập nhật: ', (id) => {
        rl.question('Giá mới: ', (price) => {
          rl.question('Mô tả mới: ', async (desc) => {
            await updateVegetable(id, price, desc);
            rl.close();
          });
        });
      });
      break;
    case '4':
      rl.question('ID cần xoá: ', async (id) => {
        await deleteVegetable(id);
        rl.close();
      });
      break;
    default:
      console.log("Lựa chọn không hợp lệ");
      rl.close();
  }
});
