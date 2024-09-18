<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="css/style.css" />
</head>

<body>
    <div class="container mt-5">
        <h1>Task Management</h1>

        <!-- New Task Button -->
        <div class="mb-3">
            <button id="newTaskBtn" class="btn btn-primary">New Task</button>
        </div>

        <!-- Search and Filter Section -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" id="taskSearch" class="form-control" placeholder="Search tasks" />
            </div>
            <div class="col-md-3">
                <input type="date" id="startDate" class="form-control" />
            </div>
            <div class="col-md-3">
                <input type="date" id="endDate" class="form-control" />
            </div>
        </div>

        <!-- Task List with Accordion -->
        <div id="taskList">
            <!-- Task items will be dynamically rendered here -->
        </div>
    </div>

    <!-- Edit Task Modal -->
    <div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editTaskModalLabel">Edit Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editTaskId" />
                    <div class="mb-3">
                        <label for="editDescription" class="form-label">Description</label>
                        <input type="text" class="form-control" id="editDescription" />
                    </div>
                    <div class="mb-3">
                        <label for="editPic" class="form-label">PIC</label>
                        <input type="text" class="form-control" id="editPic" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="saveTaskBtn">Save changes</button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/task.js"></script>
</body>

</html>