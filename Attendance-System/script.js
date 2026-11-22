// STUDENT DATA

const students = [
    { roll: 1, name: "Aarav Sharma", status: "Present" },
    { roll: 2, name: "Rahul Patil", status: "Present" },
    { roll: 3, name: "Priya Shah", status: "Present" },
    { roll: 4, name: "Rohan More", status: "Present" },
    { roll: 5, name: "Sneha Joshi", status: "Present" },
    { roll: 6, name: "Amit Kumar", status: "Present" },
    { roll: 7, name: "Neha Singh", status: "Present" },
    { roll: 8, name: "Sahil Verma", status: "Present" },
    { roll: 9, name: "Ananya Desai", status: "Present" },
    { roll: 10, name: "Karan Mehta", status: "Present" },
    { roll: 11, name: "Isha Kulkarni", status: "Present" },
    { roll: 12, name: "Aditya Joshi", status: "Present" }
];


// INITIALIZE WEBSITE

function initialize() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    document.getElementById("attendanceDate").value =
        `${year}-${month}-${day}`;

    document.getElementById("todayDate").textContent =
        today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    renderStudents();
    updateStatistics();
    updateStudentCount();
}


// DISPLAY STUDENTS

function renderStudents(list = students) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    if (list.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 3;
        cell.textContent = "No students found.";
        cell.style.textAlign = "center";

        row.appendChild(cell);
        table.appendChild(row);

        return;
    }

    list.forEach(student => {

        const row = document.createElement("tr");

        const rollCell = document.createElement("td");
        rollCell.className = "roll-number";
        rollCell.textContent = student.roll;

        const nameCell = document.createElement("td");
        nameCell.className = "student-name";
        nameCell.textContent = student.name;

        const statusCell = document.createElement("td");

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "status-buttons";


        // PRESENT BUTTON

        const presentButton = document.createElement("button");

        presentButton.className =
            "status-btn present-btn" +
            (student.status === "Present" ? " selected" : "");

        presentButton.textContent = "✓ Present";

        presentButton.addEventListener("click", () => {
            markAttendance(student.roll, "Present");
        });


        // ABSENT BUTTON

        const absentButton = document.createElement("button");

        absentButton.className =
            "status-btn absent-btn" +
            (student.status === "Absent" ? " selected" : "");

        absentButton.textContent = "× Absent";

        absentButton.addEventListener("click", () => {
            markAttendance(student.roll, "Absent");
        });


        buttonContainer.appendChild(presentButton);
        buttonContainer.appendChild(absentButton);

        statusCell.appendChild(buttonContainer);

        row.appendChild(rollCell);
        row.appendChild(nameCell);
        row.appendChild(statusCell);

        table.appendChild(row);

    });

}


// MARK ATTENDANCE

function markAttendance(roll, status) {

    const student = students.find(
        item => item.roll === roll
    );

    if (!student) return;

    student.status = status;

    searchStudents();
    updateStatistics();

}


// UPDATE STATISTICS

function updateStatistics() {

    const total = students.length;

    const present = students.filter(
        student => student.status === "Present"
    ).length;

    const absent = students.filter(
        student => student.status === "Absent"
    ).length;

    const percentage = total > 0
        ? Math.round((present / total) * 100)
        : 0;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("presentCount").textContent = present;

    document.getElementById("absentCount").textContent = absent;

    document.getElementById("percentageCount").textContent =
        percentage + "%";

}


// UPDATE STUDENT COUNT

function updateStudentCount() {

    document.getElementById("studentCountLabel").textContent =
        students.length + " Students";

}


// SEARCH STUDENTS

function searchStudents() {

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const filteredStudents = students.filter(student => {

        return (
            student.name.toLowerCase().includes(searchValue) ||
            String(student.roll).includes(searchValue)
        );

    });

    renderStudents(filteredStudents);

}


// LOAD STUDENTS

function loadStudents() {

    const selectedDate =
        document.getElementById("attendanceDate").value;

    if (!selectedDate) {

        alert("Please select an attendance date.");

        return;
    }

    students.forEach(student => {
        student.status = "Present";
    });

    document.getElementById("searchInput").value = "";

    document.getElementById("resultCard").hidden = true;

    renderStudents();
    updateStatistics();

}


// MARK ALL PRESENT

function markAllPresent() {

    students.forEach(student => {
        student.status = "Present";
    });

    searchStudents();
    updateStatistics();

}


// RESET ATTENDANCE

function resetAttendance() {

    const confirmReset = confirm(
        "Are you sure you want to reset all attendance?"
    );

    if (!confirmReset) return;

    students.forEach(student => {
        student.status = "Present";
    });

    document.getElementById("searchInput").value = "";

    document.getElementById("resultCard").hidden = true;

    renderStudents();
    updateStatistics();

}


// SUBMIT ATTENDANCE

function submitAttendance() {

    const selectedClass =
        document.getElementById("classSelect").value;

    const selectedDivision =
        document.getElementById("divisionSelect").value;

    const selectedDate =
        document.getElementById("attendanceDate").value;


    if (!selectedDate) {

        alert("Please select an attendance date.");

        return;
    }


    const presentStudents = students.filter(
        student => student.status === "Present"
    );

    const absentStudents = students.filter(
        student => student.status === "Absent"
    );


    const resultCard =
        document.getElementById("resultCard");

    const resultMessage =
        document.getElementById("resultMessage");

    const resultDetails =
        document.getElementById("resultDetails");


    resultMessage.textContent =
        `Class ${selectedClass} - ${selectedDivision} | Date: ${selectedDate}`;

    resultDetails.innerHTML = "";


    // ATTENDANCE SUMMARY

    const summary = document.createElement("div");

    const totalLine = document.createElement("p");

    totalLine.textContent =
        `Total Students: ${students.length}`;


    const presentLine = document.createElement("p");

    presentLine.textContent =
        `Present: ${presentStudents.length}`;


    const absentLine = document.createElement("p");

    absentLine.textContent =
        `Absent: ${absentStudents.length}`;


    summary.appendChild(totalLine);
    summary.appendChild(presentLine);
    summary.appendChild(absentLine);


    // ABSENT STUDENTS LIST

    const heading = document.createElement("h4");

    heading.textContent = "Absent Students";
    heading.style.marginTop = "15px";


    const list = document.createElement("ul");


    if (absentStudents.length === 0) {

        const item = document.createElement("li");

        item.textContent = "No absent students";

        list.appendChild(item);

    } else {

        absentStudents.forEach(student => {

            const item = document.createElement("li");

            item.textContent =
                `${student.name} (Roll No. ${student.roll})`;

            list.appendChild(item);

        });

    }


    resultDetails.appendChild(summary);
    resultDetails.appendChild(heading);
    resultDetails.appendChild(list);


    resultCard.hidden = false;

    resultCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// BUTTON EVENT LISTENERS

document.getElementById("loadBtn")
    .addEventListener("click", loadStudents);

document.getElementById("resetBtn")
    .addEventListener("click", resetAttendance);

document.getElementById("submitBtn")
    .addEventListener("click", submitAttendance);

document.getElementById("markAllBtn")
    .addEventListener("click", markAllPresent);

document.getElementById("searchInput")
    .addEventListener("input", searchStudents);


// START WEBSITE

initialize();