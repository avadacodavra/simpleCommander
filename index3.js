const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const program = new Command();

const tasksFile = path.join(__dirname, 'tasks.json');

// Helper function to load tasks from the JSON file
function loadTasks() {
  if (fs.existsSync(tasksFile)) {
    const tasksData = fs.readFileSync(tasksFile, 'utf8');
    return JSON.parse(tasksData);
  }
  return [];
}

// Helper function to save tasks to the JSON file
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');
}

program
  .name('todo')
  .description('A simple CLI to manage your tasks')
  .version('1.0.0')
  .option('-a, --add <task>', 'add a new task')
  .option('-u, --update <index> <newTask>', 'update an existing task', (index, newTask) => ({ index, newTask }))
  .option('-d, --done <index>', 'mark a task as done')
  .option('-r, --remove <index>', 'delete a task')
  .option('-l, --list', 'list all tasks')
  .action((options) => {
    let tasks = loadTasks();

    if (options.add) {
      tasks.push({ task: options.add, done: false });
      saveTasks(tasks);
      console.log(`Task added: "${options.add}"`);
    }

    if (options.update) {
      const { index, newTask } = options.update;
      const taskIndex = parseInt(index, 10);
      if (tasks[taskIndex]) {
        tasks[taskIndex].task = newTask;
        saveTasks(tasks);
        console.log(`Task ${taskIndex} updated to: "${newTask}"`);
      } else {
        console.log(`Task at index ${taskIndex} does not exist.`);
      }
    }

    if (options.done) {
      const taskIndex = parseInt(options.done, 10);
      if (tasks[taskIndex]) {
        tasks[taskIndex].done = true;
        saveTasks(tasks);
        console.log(`Task ${taskIndex} marked as done: "${tasks[taskIndex].task}"`);
      } else {
        console.log(`Task at index ${taskIndex} does not exist.`);
      }
    }

    if (options.remove) {
      const taskIndex = parseInt(options.remove, 10);
      if (tasks[taskIndex]) {
        const deletedTask = tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        console.log(`Task deleted: "${deletedTask[0].task}"`);
      } else {
        console.log(`Task at index ${taskIndex} does not exist.`);
      }
    }

    if (options.list) {
      if (tasks.length === 0) {
        console.log('No tasks found.');
      } else {
        tasks.forEach((task, index) => {
          const status = task.done ? '[DONE]' : '[TODO]';
          console.log(`${index}: ${status} ${task.task}`);
        });
      }
    }
  });

program.parse(process.argv);
