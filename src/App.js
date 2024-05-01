import React, { useEffect, useState,useCallback } from 'react';
import { Tooltip, PieChart, Pie, Cell } from 'recharts';
import "./App.css"

const TaskForm = ({ addTask }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName || !description || !dueDate || !assignee) {
      setError('All fields are required');
      return;
    }
    addTask({ taskName, description, dueDate, assignee });
    setTaskName('');
    setDescription('');
    setDueDate('');
    setAssignee('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <h3 >Add New Task</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="form-control">
        <div className="margin">
          <label className='label'>Task Name:</label>
          <input type="text" className='input' value={taskName} onChange={(e) => setTaskName(e.target.value)} />
        </div>
        <div className="margin">
          <label className='label'>Description:</label>
          <textarea value={description} className='textarea' onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="margin">
          <label className='label'>Due Date:</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="margin">
          <label className='label'>Assignee:</label>
          <select className="select" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
            <option value="">Select Assignee</option>
            <option value="User1">User 1</option>
            <option value="User2">User 2</option>
            <option value="Team1">Team 1</option>
            <option value="Team2">Team 2</option>
          </select>
        </div>
        <div className="margin">
          <button className="button" type="submit">Add Task</button>
        </div>
      </div>
    </form>
  );
};

const TaskCard = ({ task, onUpdateStatus }) => {
  const { taskName, description, dueDate, assignee, status } = task;
  const statusClass = status ? status.toLowerCase() : '';

  return (
    <div className={`task-card ${statusClass}`} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }} >
      <h3>{taskName}</h3>
      <p>{description}</p>
      <p>Due Date: {dueDate}</p>
      {assignee && <p>Assignee: {assignee}</p>}
      <p>Status: {status}</p>
      <button onClick={() => onUpdateStatus('Started')}>Start</button>
      <button onClick={() => onUpdateStatus('Completed')}>Complete</button>
      <button onClick={() => onUpdateStatus('In Progress')}>In Progress</button>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [assignees, setAssignees] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const updateStatus = (index, newStatus) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = newStatus;
    setTasks(updatedTasks);
  };

  const updateAssignees = useCallback(() => {
    let filteredTasks = tasks;
    if (selectedStatus !== 'All') {
        filteredTasks = tasks.filter(task => task.status === selectedStatus);
    }
    const newAssignees = filteredTasks.map(task => task.assignee);
    setAssignees([...new Set(newAssignees)]);
}, [tasks, selectedStatus]);

useEffect(() => {
    // Update assignees when tasks or selectedStatus change
    updateAssignees();
}, [updateAssignees]);


  

  const calculateUserPerformance = () => {
    // Initialize counts for different statuses
    const statusCounts = { Started: 0, Completed: 0, 'In Progress': 0 }

    // Count tasks for each status
    tasks.forEach(task => {
      switch (task.status) {
        case 'Started':
          statusCounts.Started++;
          break;
        case 'Completed':
          statusCounts.Completed++;
          break;
        default:
          statusCounts['In Progress']++;
      }
    });

    return [
      { name: 'Started', value: statusCounts.Started },
      { name: 'Completed', value: statusCounts.Completed },
      {name: 'In Progress', value: statusCounts['In Progress'] }
    ];
  };

  const [userPerformance, setUserPerformance] = useState(calculateUserPerformance());
 
  const updatePerformance = useCallback(() => {
    setUserPerformance(calculateUserPerformance());
  }, [tasks,calculateUserPerformance]);
  useEffect(() => {
    // Update user performance when tasks change
    updatePerformance();
  }, [tasks,updatePerformance]);
  return (
    <div>
      <TaskForm addTask={addTask} />
      <h2>Task List</h2>
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} onUpdateStatus={(newStatus) => updateStatus(index, newStatus)} />
      ))}

      <h2>User Performance</h2>
      <PieChart width={400} height={300}>
        <Pie dataKey="value" data={userPerformance} cx={200} cy={150} outerRadius={100} fill="#8884d8" label>
          {userPerformance.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <div>
        <h2>Filter Assignees by Status</h2>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Started">Started</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
        </select>
        <h3>Assignees:</h3>
        <ul>
          {assignees.map((assignee, index) => (
            <li key={index}>{assignee}</li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

const getColor = (status) => {
  switch (status) {
    case 'Started':
      return 'red';
    case 'Completed':
      return 'green';
    case 'In Progress':
      return 'yellow';
    default:
      return '#8884d8';
  }
};

const App = () => {
  return (
    <div className="App"> 
      <h1 className="head">Task Management App</h1>
      <TaskList />
    </div>
  );
};

export default App;

