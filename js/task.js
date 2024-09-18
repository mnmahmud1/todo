let tasks = [];
let activeTask = null;

document.getElementById("newTaskBtn").addEventListener("click", createTask);
document.getElementById("saveTaskBtn").addEventListener("click", saveTask);
document.getElementById("taskSearch").addEventListener("input", filterTasks);
document.getElementById("startDate").addEventListener("change", filterTasks);
document.getElementById("endDate").addEventListener("change", filterTasks);

function createTask() {
	const task = {
		id: tasks.length + 1,
		description: `Task ${tasks.length + 1}`,
		status: "paused",
		startTime: null,
		endTime: null,
		totalDuration: 0, // Total time in seconds
		user: "User123",
		pic: "-",
		actions: [], // History of start/pause events for the Gantt chart
		interval: null,
	};

	tasks.push(task);
	renderTasks();
}

function startTask(id) {
	if (activeTask) {
		alert("You can only start one task at a time.");
		return;
	}

	const task = tasks.find(t => t.id === id);
	if (task && task.status !== "in progress" && task.status !== "completed") {
		task.status = "in progress";
		task.startTime = new Date();
		task.actions.push({ action: "start", time: task.startTime });
		task.interval = setInterval(() => updateTimer(task), 1000);
		activeTask = task;
		renderTasks();
	}
}

function pauseTask(id) {
	const task = tasks.find(t => t.id === id);
	if (task && task.status === "in progress") {
		clearInterval(task.interval);
		task.status = "paused";
		const pauseTime = new Date();
		task.actions.push({ action: "pause", time: pauseTime });
		task.totalDuration += Math.floor((pauseTime - task.startTime) / 1000);
		task.startTime = null;
		activeTask = null;
		renderTasks();
	}
}

function stopTask(id) {
	const task = tasks.find(t => t.id === id);
	if (task && task.status !== "completed") {
		clearInterval(task.interval);
		task.status = "completed";
		task.endTime = new Date();
		const stopTime = new Date();
		task.totalDuration += task.startTime ? Math.floor((stopTime - task.startTime) / 1000) : 0;
		task.actions.push({ action: "stop", time: stopTime });
		task.startTime = null;
		activeTask = null;
		renderTasks();
	}
}

function updateTimer(task) {
	task.totalDuration++;
	renderTasks();
}

function renderTasks() {
	const taskList = document.getElementById("taskList");
	taskList.innerHTML = tasks
		.map(
			task => `
        <div class="row mb-3">
            <div class="col-md-8">
                <div class="accordion" id="accordionTask${task.id}">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTask${task.id}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTask${task.id}" aria-expanded="false" aria-controls="collapseTask${task.id}">
                                ${task.description} (Status: ${task.status})
                            </button>
                        </h2>
                        <div id="collapseTask${task.id}" class="accordion-collapse collapse" aria-labelledby="headingTask${task.id}" data-bs-parent="#accordionTask${task.id}">
                            <div class="accordion-body">
                                <strong>User:</strong> ${task.user} <br>
                                <strong>PIC:</strong> ${task.pic} <br>
                                <strong>Total Time:</strong> ${formatDuration(task.totalDuration)} <br>
                                ${renderGanttChart(task.actions)}
                                ${task.status !== "completed" ? `<button class="btn btn-danger mt-2" onclick="stopTask(${task.id})">Stop</button>` : ""}
                                <button class="btn btn-primary mt-2" onclick="openEditModal(${task.id})">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                ${task.status === "paused" && task.status !== "completed" ? `<button class="btn btn-success" onclick="startTask(${task.id})">Start</button>` : ""}
                ${task.status === "in progress" ? `<button class="btn btn-warning" onclick="pauseTask(${task.id})">Pause</button>` : ""}
            </div>
        </div>
    `
		)
		.join("");
}

function renderGanttChart(actions) {
	let chartHtml = `<div class="gantt-chart mt-3">`;
	actions.forEach((action, index) => {
		if (action.action === "start") {
			chartHtml += `<div class="gantt-bar bg-success" style="width: 100px;">Start: ${formatTime(action.time)}</div>`;
		} else if (action.action === "pause") {
			chartHtml += `<div class="gantt-bar bg-warning" style="width: 120px;">Pause: ${formatTime(action.time)}</div>`;
		} else if (action.action === "stop") {
			chartHtml += `<div class="gantt-bar bg-danger" style="width: 100px;">Stop: ${formatTime(action.time)}</div>`;
		}
	});
	chartHtml += `</div>`;
	return chartHtml;
}

function formatDuration(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;
	return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

function formatTime(time) {
	const date = new Date(time);
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function openEditModal(taskId) {
	const task = tasks.find(t => t.id === taskId);
	if (task) {
		document.getElementById("editTaskId").value = task.id;
		document.getElementById("editDescription").value = task.description;
		document.getElementById("editPic").value = task.pic;
		const modal = new bootstrap.Modal(document.getElementById("editTaskModal"));
		modal.show();
	}
}

function saveTask() {
	const taskId = document.getElementById("editTaskId").value;
	const description = document.getElementById("editDescription").value;
	const pic = document.getElementById("editPic").value;

	const task = tasks.find(t => t.id == taskId);
	if (task) {
		task.description = description;
		task.pic = pic;
	}

	const modal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
	modal.hide();
	renderTasks();
}

function filterTasks() {
	const searchText = document.getElementById("taskSearch").value.toLowerCase();
	const startDate = new Date(document.getElementById("startDate").value);
	const endDate = new Date(document.getElementById("endDate").value);

	const filteredTasks = tasks.filter(task => {
		const taskDate = new Date(task.startTime);
		return task.description.toLowerCase().includes(searchText) && taskDate >= startDate && taskDate <= endDate;
	});

	// Render only filtered tasks
	document.getElementById("taskList").innerHTML = filteredTasks.map(task => renderTaskHtml(task)).join("");
}

// Function to automatically stop all tasks at 17:00 WIB
function autoStopAt17() {
	const currentTime = new Date();
	const stopTime = new Date(currentTime);
	stopTime.setHours(17, 0, 0); // Set stop time to 17:00 WIB

	if (currentTime >= stopTime) {
		tasks.forEach(task => {
			if (task.status === "in progress") {
				stopTask(task.id);
			}
		});
	}
}

setInterval(autoStopAt17, 60000); // Check every minute
