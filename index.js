document.addEventListener("DOMContentLoaded", function () {
  const numProcess = document.getElementById("numProcess");
  const btnNumProcess = document.getElementById("btnNumProcess");
  const numProcessContainer = document.querySelector(".num_process_container");
  const arrivalTimeContainer = document.querySelector(
    ".arrival_time_container"
  );
  const burstTimeContainer = document.querySelector(".burst_time_container");
  const displayContainer = document.querySelector(".display_container");
  const quantumTime = document.getElementById("quantumTime");

  btnNumProcess.addEventListener("click", function () {
    arrivalTimeContainer.innerHTML = "";

    let numProcessVal = parseInt(numProcess.value);
    let quantumTimeVal = parseInt(quantumTime.value);
    if (isNaN(numProcessVal) || numProcessVal <= 0) {
      alert("Please enter a valid number of processes.");
      return;
    }
    if (isNaN(quantumTimeVal) || quantumTimeVal <= 0) {
      alert("Please enter a valid number for quantum time");
      return;
    }
    let burstTimes = [];
    let arrivalTimes = [];
    let arrivalTimeDiv = document.createElement("div");
    arrivalTimeDiv.classList.add("process", "d-flex", "flex-column", "mb-3");
    for (let i = 1; i <= numProcessVal; i++) {
      let arrivalLabel = document.createElement("label");
      arrivalLabel.setAttribute("for", "arrivalTime" + i);
      arrivalLabel.textContent = "Arrival Time for Process " + i + ": ";
      arrivalLabel.classList.add("mb-1", "text-muted");
      let arrivalInput = document.createElement("input");
      arrivalInput.type = "number";
      arrivalInput.id = "arrivalTime" + i;
      arrivalInput.name = "arrivalTime" + i;
      arrivalInput.min = "0";
      arrivalInput.required = true;
      arrivalInput.classList.add("form-control", "mb-2");
      arrivalTimeDiv.appendChild(arrivalLabel);
      arrivalTimeDiv.appendChild(arrivalInput);
      numProcessContainer.style.display = "none";
      arrivalTimes.push(arrivalInput);
    }
    let arrivalTimeBtn = document.createElement("button");
    arrivalTimeBtn.setAttribute("id", "arrivalTimeBtn");
    arrivalTimeBtn.textContent = "Submit";
    arrivalTimeBtn.classList.add("btn", "btn-primary", "mt-2");
    arrivalTimeDiv.appendChild(arrivalTimeBtn);
    arrivalTimeContainer.appendChild(arrivalTimeDiv);
    let burstTimeDiv = document.createElement("div");
    burstTimeDiv.classList.add("process", "d-flex", "flex-column", "mb-3");
    arrivalTimeBtn.addEventListener("click", function () {
      burstTimeContainer.innerHTML = "";
      arrivalTimeContainer.style.display = "none";
      for (let i = 1; i <= numProcessVal; i++) {
        let burstTimeLabel = document.createElement("label");
        burstTimeLabel.setAttribute("for", "burstTime" + i);
        burstTimeLabel.textContent = "Burst Time for Process " + i + ": ";
        burstTimeLabel.classList.add("mb-1", "text-muted");
        let burstTimeInput = document.createElement("input");
        burstTimeInput.type = "number";
        burstTimeInput.id = "burstTime" + i;
        burstTimeInput.name = "burstTime" + i;
        burstTimeInput.min = "0";
        burstTimeInput.required = true;
        burstTimeInput.classList.add("form-control", "mb-2");
        burstTimeDiv.appendChild(burstTimeLabel);
        burstTimeDiv.appendChild(burstTimeInput);
        numProcessContainer.style.display = "none";
        burstTimes.push(burstTimeInput);
      }
      let burstTimeBtn = document.createElement("button");
      burstTimeBtn.setAttribute("id", "burstTimeBtn");
      burstTimeBtn.textContent = "Submit";
      burstTimeBtn.classList.add("btn", "btn-primary", "mt-2");

      burstTimeBtn.addEventListener("click", function () {
        console.log("Button clicked!"); // Log that the button is clicked

        displayContainer.innerHTML = "";
        burstTimeContainer.style.display = "none";
        console.log(
          "Display container cleared and burst time container hidden."
        );

        let table = document.createElement("table");
        table.classList.add("table", "table-striped", "text-center"); // Add the text-center class
        console.log("Table element created.");
        table.classList.add("table", "table-striped", "text-center");

        let thead = document.createElement("thead");
        let headerRow = document.createElement("tr");
        console.log("Table header row created.");

        let headers = [
          "Process",
          "Arrival Time",
          "Burst Time",
          "Completion Time",
          "Turnaround Time",
          "Waiting Time",
        ];
        headers.forEach((headerText) => {
          let th = document.createElement("th");
          th.scope = "col";
          th.textContent = headerText;
          headerRow.appendChild(th);
        });
        console.log("Table headers created and added to header row.");

        thead.appendChild(headerRow);
        table.appendChild(thead);
        console.log("Header row added to the table.");

        let tbody = document.createElement("tbody");
        console.log("Table body created.");

        // Round Robin Scheduling Calculation
        let processes = [];
        for (let i = 0; i < numProcessVal; i++) {
          processes.push({
            process: i + 1,
            arrivalTime: parseInt(arrivalTimes[i].value),
            burstTime: parseInt(burstTimes[i].value),
            remainingTime: parseInt(burstTimes[i].value),
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
          });
        }
        console.log(
          "Processes initialized with arrival time, burst time, etc."
        );

        let currentTime = 0;
        let queue = [];
        let completedProcesses = 0;

        // Initialize the queue with processes that have arrived at time 0
        processes.forEach((process) => {
          if (process.arrivalTime <= currentTime) {
            queue.push(process);
            console.log(
              `Process ${process.process} added to the initial queue.`
            );
          }
        });

        while (completedProcesses < numProcessVal) {
          if (queue.length === 0) {
            currentTime++;
            console.log(
              "No processes in the queue. Incrementing current time."
            );
            // Check if new processes have arrived and add them to the queue
            processes.forEach((process) => {
              if (
                process.arrivalTime <= currentTime &&
                process.remainingTime > 0 &&
                !queue.includes(process)
              ) {
                queue.push(process);
                console.log(`Process ${process.process} added to the queue.`);
              }
            });
            continue;
          }

          let currentProcess = queue.shift();
          console.log(`Processing current process ${currentProcess.process}.`);

          let timeSlice = Math.min(
            currentProcess.remainingTime,
            quantumTimeVal
          );
          currentProcess.remainingTime -= timeSlice;
          currentTime += timeSlice;
          console.log(
            `Time slice for current process: ${timeSlice}. Current time: ${currentTime}.`
          );

          // Update completion time if process is finished
          if (currentProcess.remainingTime === 0) {
            currentProcess.completionTime = currentTime;
            completedProcesses++;
            console.log(
              `Process ${currentProcess.process} completed. Completion time: ${currentTime}.`
            );
          }

          // Add any new processes that have arrived to the queue
          processes.forEach((process) => {
            if (
              process.arrivalTime <= currentTime &&
              process.remainingTime > 0 &&
              !queue.includes(process) &&
              process !== currentProcess
            ) {
              queue.push(process);
              console.log(`Process ${process.process} added to the queue.`);
            }
          });

          // Re-add the current process to the queue if it's not finished
          if (currentProcess.remainingTime > 0) {
            queue.push(currentProcess);
            console.log(
              `Process ${currentProcess.process} not completed. Re-added to the queue.`
            );
          }
        }

        // Calculate turnaround time and waiting time
        let totalTurnaroundTime = 0;
        let totalWaitingTime = 0;
        let totalCompletionTime = 0;

        processes.forEach((process) => {
          process.turnaroundTime = process.completionTime - process.arrivalTime;
          process.waitingTime = process.turnaroundTime - process.burstTime;

          totalTurnaroundTime += process.turnaroundTime;
          totalWaitingTime += process.waitingTime;
          totalCompletionTime += process.completionTime;
        });
        console.log(
          "Turnaround times and waiting times calculated for all processes."
        );

        processes.forEach((process) => {
          let row = document.createElement("tr");
          console.log(`Creating row for process ${process.process}.`);

          let processCell = document.createElement("td");
          processCell.textContent = `Process ${process.process}`;
          row.appendChild(processCell);
          let arrivalTimeCell = document.createElement("td");
          arrivalTimeCell.textContent = process.arrivalTime;
          row.appendChild(arrivalTimeCell);
          let burstTimeCell = document.createElement("td");
          burstTimeCell.textContent = process.burstTime;
          row.appendChild(burstTimeCell);
          let completionTimeCell = document.createElement("td");
          completionTimeCell.textContent = process.completionTime;
          row.appendChild(completionTimeCell);
          let turnaroundTimeCell = document.createElement("td");
          turnaroundTimeCell.textContent = process.turnaroundTime;
          row.appendChild(turnaroundTimeCell);
          let waitingTimeCell = document.createElement("td");
          waitingTimeCell.textContent = process.waitingTime;
          row.appendChild(waitingTimeCell);

          tbody.appendChild(row);
          console.log(
            `Row for process ${process.process} created and added to the table body.`
          );
        });

        table.appendChild(tbody);
        displayContainer.appendChild(table);
        console.log(
          "Table body appended to the table. Table appended to display container."
        );

        // Calculate averages
        let avgCompletionTime = totalCompletionTime / numProcessVal;
        let avgTurnaroundTime = totalTurnaroundTime / numProcessVal;
        let avgWaitingTime = totalWaitingTime / numProcessVal;

        // Create paragraph element for averages
        let avgParagraph = document.createElement("p");
        avgParagraph.innerHTML = `
          <strong>Average Completion Time:</strong> ${avgCompletionTime.toFixed(
            2
          )}<br>
          <strong>Average Turnaround Time:</strong> ${avgTurnaroundTime.toFixed(
            2
          )}<br>
          <strong>Average Waiting Time:</strong> ${avgWaitingTime.toFixed(2)}
        `;

        // Append the paragraph to the display container
        displayContainer.appendChild(avgParagraph);
      });

      burstTimeDiv.appendChild(burstTimeBtn);
      burstTimeContainer.appendChild(burstTimeDiv);
    });
  });
});