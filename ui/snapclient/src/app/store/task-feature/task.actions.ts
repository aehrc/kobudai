import {Action} from '@ngrx/store';
import {Task} from '../../_models/task';
import {HttpErrorResponse} from '@angular/common/http';


export enum TaskActionTypes {
  LOAD_TASKS_SUCCESS = '[Task] Tasks load succeeded',
  LOAD_TASKS_FAILED = '[Task] Tasks load failed',
  LOAD_TASKS_FOR_MAP = '[Task] Tasks load for map',
  ADD_TASK = '[Task] Add Task request',
  ADD_TASK_SUCCESS = '[Task] Add Task succeeded',
  ADD_TASK_FAILED = '[Task] Add Task failed',
  DELETE_TASK = '[Task] Delete Task request',
  DELETE_TASK_SUCCESS = '[Task] Delete/Complete Task succeeded',
  DELETE_TASK_FAILED = '[Task] Delete/Complete Task failed',
  COMPLETE_TASK = '[Task] Complete Task request',
}

export class LoadTasksForMap implements Action {
  readonly type = TaskActionTypes.LOAD_TASKS_FOR_MAP;

  constructor(public payload: {id: string}) {
  }
}

export class LoadTasksSuccess implements Action {
  readonly type = TaskActionTypes.LOAD_TASKS_SUCCESS;

  constructor(public payload: Task[]) {
  }
}

export class LoadTasksFailure implements Action {
  readonly type = TaskActionTypes.LOAD_TASKS_FAILED;

  constructor(public payload: { error: string }) {
  }
}

export class AddTask implements Action {
  readonly type = TaskActionTypes.ADD_TASK;

  constructor(public payload: Task) {
  }
}

export class AddTaskSuccess implements Action {
  readonly type = TaskActionTypes.ADD_TASK_SUCCESS;

  constructor(public payload: Task) {
  }
}

export class AddTaskFailure implements Action {
  readonly type = TaskActionTypes.ADD_TASK_FAILED;

  constructor(public payload: { error: HttpErrorResponse }) {
  }
}

export class DeleteTask implements Action {
  readonly type = TaskActionTypes.DELETE_TASK;

  constructor(public payload: Task) {
  }
}

export class DeleteTaskSuccess implements Action {
  readonly type = TaskActionTypes.DELETE_TASK_SUCCESS;

  constructor(public payload: Task) {
  }
}

export class DeleteTaskFailure implements Action {
  readonly type = TaskActionTypes.DELETE_TASK_FAILED;

  constructor(public payload: { error: HttpErrorResponse }) {
  }
}

export class CompleteTask implements Action {
  readonly type = TaskActionTypes.COMPLETE_TASK;

  constructor(public payload: Task) {
  }
}


export type TaskActions = LoadTasksSuccess
  | LoadTasksFailure
  | LoadTasksForMap
  | AddTask
  | AddTaskSuccess
  | AddTaskFailure
  | DeleteTask
  | DeleteTaskSuccess
  | DeleteTaskFailure
  | CompleteTask;

