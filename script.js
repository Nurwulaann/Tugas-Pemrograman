const apiUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m";

const weatherData = document.getElementById("weatherData");
const statusText = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");

async function getWeather() {
    statusText.textContent = "Sedang mengambil data cuaca...";
    weatherData.innerHTML = "";
    refreshBtn.disabled = true;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Gagal mengambil data API.");
        }

        const data = await response.json();

        const times = data.hourly.time;
        const temperatures = data.hourly.temperature_2m;

        const jumlahData = Math.min(10, times.length);
        const suhu = temperatures.slice(0, jumlahData);

        document.getElementById("totalData").textContent =
            jumlahData;

        const suhuValid = suhu.filter(value => value !== null);

        if (suhuValid.length > 0) {
            document.getElementById("maxTemp").textContent =
                Math.max(...suhuValid) + " °C";

            document.getElementById("minTemp").textContent =
                Math.min(...suhuValid) + " °C";
        }

        for (let i = 0; i < jumlahData; i++) {
            const row = document.createElement("tr");

            const waktu = document.createElement("td");
            waktu.textContent = times[i].replace("T", " ");

            const nomor = document.createElement("td");
            nomor.textContent = i + 1;

            const temperatur = document.createElement("td");
            temperatur.className = "temp";
            temperatur.textContent =
                temperatures[i] === null
                ? "Tidak tersedia"
                : temperatures[i] + " °C";

            row.appendChild(nomor);
            row.appendChild(waktu);
            row.appendChild(temperatur);

            weatherData.appendChild(row);
        }

        statusText.textContent =
            "✓ Data cuaca berhasil dimuat. Menampilkan " +
            jumlahData + " data pertama.";

    } catch (error) {
        statusText.textContent =
            "Gagal mengambil data. Periksa koneksi internet.";

        weatherData.innerHTML = `
            <tr>
                <td colspan="3">
                    Data tidak dapat ditampilkan.
                </td>
            </tr>
        `;

        console.error(error);

    } finally {
        refreshBtn.disabled = false;
    }
}

refreshBtn.addEventListener("click", getWeather);

getWeather();
