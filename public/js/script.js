

document.addEventListener("DOMContentLoaded", function() {
        let events = []; // Inisialisasi variabel events

        // Fungsi untuk mendapatkan tanggal hari ini dalam format tertentu
        function getTodayDateString() {
            const today = new Date();
            return today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }).replace(/ /g, ' ');
        }

        // Fungsi untuk memperbarui waktu secara real-time
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format waktu: HH:MM
            const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }); // Format tanggal: Senin, 01 Januari 2023
            document.getElementById('datetime').innerHTML = `Event Pada ${timeString} - ${dateString}`; // Menampilkan waktu dan tanggal
        }

        // Panggil updateTime setiap detik untuk memperbarui waktu secara real-time
        setInterval(updateTime, 1000);

        // Fungsi untuk menampilkan daftar acara
        function displayEvents(events) {
            const eventsContainer = document.getElementById('events-container');
            eventsContainer.innerHTML = ''; // Clear previous results

            events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('event');
                eventElement.innerHTML = `
                    <h2>${event['Nama Acara (Link acara klik)']}</h2>
                    <p>Date: ${event['Tanggal']}</p>
                    <p>Time: ${event['Jam']}</p>
                    <p>Location: ${event['Lokasi (baca keterangan lebih lanjut di Facebook Page)']}</p>
                    <p>Area: ${event['Area']}</p>
                    <p>Last Update: ${event['Last Update']}</p>
                    <a href="${event['Link Acara']}" target="_blank">Event Link</a>
                `;
                eventsContainer.appendChild(eventElement);
            });

            if (events.length === 0) {
                eventsContainer.innerHTML = '<p>Event coming soon...</p>';
            }
        }

        // Fungsi untuk mencari acara berdasarkan kueri
        function searchEvents(query) {
            const lowerCaseQuery = query.toLowerCase();
            return events.filter(event => event['Nama Acara (Link acara klik)'].toLowerCase().includes(lowerCaseQuery) || event['Lokasi (baca keterangan lebih lanjut di Facebook Page)'].toLowerCase().includes(lowerCaseQuery));
        }

        // Fungsi untuk menangani pencarian acara
        function handleSearch() {
            const searchQuery = document.getElementById('search-input').value.trim();
            if (searchQuery) {
                const filteredEvents = searchEvents(searchQuery);
                displayEvents(filteredEvents);
            } else {
                const todayEvents = events.filter(event => event['Tanggal'] === getTodayDateString());
                displayEvents(todayEvents);
            }
        }

        document.getElementById('search-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });

        // Fungsi untuk mengubah tema
        document.getElementById('toggleTheme').addEventListener('click', () => {
            const body = document.body;
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });

        // Mengatur tema berdasarkan preferensi yang tersimpan
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Fungsi untuk mendapatkan data acara dari API
        function fetchDataFromAPI() {
            const url = 'https://sheet.best/api/sheets/07db4fd7-1649-4d61-989c-da6ec069a256';

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    events = data;
                    const todayEvents = events.filter(event => event['Tanggal'] === getTodayDateString());
                    displayEvents(todayEvents); // Menampilkan daftar acara setelah menerima data dari API
                    populateEventOptions(); // Menambahkan opsi acara ke dropdown setelah mendapatkan data dari API
                    displayLastAttendance(); // Menampilkan data absensi terakhir
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

        fetchDataFromAPI(); // Memanggil fungsi untuk mendapatkan data dari API

        // Fungsi untuk menambahkan opsi acara ke dalam dropdown
        function populateEventOptions() {
            const eventSelect = document.getElementById('event');
            events.forEach(event => {
                const option = document.createElement('option');
                option.text = event['Nama Acara (Link acara klik)'];
                eventSelect.add(option);
            });
        }

        // Fungsi untuk menyimpan data absensi ke dalam file JSON
  // Fungsi untuk menyimpan data absensi ke dalam file JSON
function saveAttendanceData(data) {
    console.log('Data absensi yang akan disimpan:', data); // Tambahkan pesan log untuk memeriksa data yang akan disimpan

    fetch('/saveAttendance', { // Change the URL to match the server route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save attendance data');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response dari server:', data); // Tambahkan pesan log untuk melihat respons dari server
        console.log('Attendance data saved:', data);
    })
    .catch(error => console.error('Error saving attendance data:', error));
}


// Function to save attendance data to local storage
function saveAttendanceDataToLocal(data) {
    // Retrieve existing attendance data from local storage or initialize as an empty array
    const existingData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    
    // Add new attendance data to the existing array
    existingData.push(data);
    
    // Save the updated attendance data back to local storage
    localStorage.setItem('attendanceData', JSON.stringify(existingData));
}

// Example of how to call this function
const attendanceData = { nama, cosplay, event: selectedEventName };
saveAttendanceDataToLocal(attendanceData);
        // Fungsi untuk menampilkan data absensi terakhir
        function displayLastAttendance() {
            fetch('absensi.json')
                .then(response => response.json())
                .then(data => {
                    const lastAttendanceBody = document.getElementById('last-attendance-body');
                    data.forEach(entry => {
                        const row = lastAttendanceBody.insertRow();
                        const cellNama = row.insertCell(0);
                        const cellCosplay = row.insertCell(1);
                        const cellEvent = row.insertCell(2);
                        cellNama.innerHTML = entry.nama;
                        cellCosplay.innerHTML = entry.cosplay;
                        cellEvent.innerHTML = entry.event;
                    });
                })
                .catch(error => console.error('Error fetching last attendance data:', error));
        }

        // Menangani submit formulir absensi
        document.getElementById('attendance-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Menghentikan aksi bawaan dari formulir

            // Mengambil nilai input dari formulir absensi
            const nama = document.getElementById('nama').value;
            const cosplay = document.getElementById('cosplay').value;
            const selectedEventIndex = document.getElementById('event').selectedIndex;
            const selectedEventName = events[selectedEventIndex - 1]['Nama Acara (Link acara klik)']; // Menyesuaikan indeks dengan opsi yang dipilih

            // Menambahkan data absensi terakhir ke dalam tabel
            const lastAttendanceBody = document.getElementById('last-attendance-body');
            const row = lastAttendanceBody.insertRow();
            const cellNama = row.insertCell(0);
            const cellCosplay = row.insertCell(1);
            const cellEvent = row.insertCell(2);
            cellNama.innerHTML = nama;
            cellCosplay.innerHTML = cosplay;
            cellEvent.innerHTML = selectedEventName;

            // Menyimpan data absensi ke dalam file JSON
            const attendanceData = { nama, cosplay, event: selectedEventName };
            saveAttendanceData(attendanceData);

            // Menampilkan pesan berhasil
            alert('Terima kasih atas partisipasi Anda!');
        });
    });

