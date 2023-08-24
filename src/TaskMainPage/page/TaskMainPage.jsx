import React, { useEffect, useState } from "react";
import { HeadDate } from "../components/headDate";
import { TaskCard } from "../components/TaskCard";
import { TaskFilter } from "../components/TaskFilter";
import { AddTaskCard } from "../components/AddTaskCard";
import { useTaskStore } from "../../hooks/useTaskStore";
import { TaskModal } from "../components/TaskModal";
import { useModal } from "../../hooks/useModal";
import { useFilter } from "../../hooks/useFilter";


export const TaskMainPage = () => {
  const { tasks, startLoadingTasks, setActiveTask } = useTaskStore();
  const { openModal } = useModal();
  const { setSelectedFilter, setSortOrder, filteredAndSortedTasks } = useFilter(tasks);
  const [searchValue, setSearchValue] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  const filterTask = (task) => {
    if (searchValue === "") {
      return true;
    } else {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      return task?.description?.toLowerCase().includes(lowerCaseSearchValue);
    }
  };

  const filterByDateRange = (task) => {
    if (!startDateFilter || !endDateFilter) {
      return true;
    }
    const taskDate = new Date(task.dueDate);
    return taskDate >= startDateFilter && taskDate <= endDateFilter;
  };

  const handleClearFilter = () => {
    setSelectedFilter("");
    setSortOrder("creationDate");
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  const onSelect = (task) => {
    setActiveTask(task);
  };

  const onDoubleClick = (task) => {
    openModal();
  };

  useEffect(() => {
    startLoadingTasks();
  }, []);

  return (
    <>
      <HeadDate />
      <TaskFilter
        onFilterChange={setSelectedFilter}
        onSortChange={setSortOrder}
        onClearFilter={handleClearFilter}
      />
      <input
        type="text"
        className="inputSearch"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Buscar Tarea"
      />
 
      {filteredAndSortedTasks.length > 0 && (
        <div>
          {filteredAndSortedTasks
            .filter(filterTask)
            .filter(filterByDateRange)
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSelectEvent={onSelect}
                onDoubleClickEvent={onDoubleClick}
              />
            ))}
        </div>
      )}

      <AddTaskCard />
      <TaskModal />
    </>
  );
};
