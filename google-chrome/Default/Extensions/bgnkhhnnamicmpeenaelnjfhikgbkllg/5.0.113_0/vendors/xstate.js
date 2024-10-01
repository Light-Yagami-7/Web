"use strict";
(self["webpackChunkbrowser_extension"] = self["webpackChunkbrowser_extension"] || []).push([[840],{

/***/ 8743:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sx: () => (/* binding */ fromPromise)
/* harmony export */ });
/* unused harmony exports createEmptyActor, fromCallback, fromEventObservable, fromObservable, fromTransition */
/* harmony import */ var _dist_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41570);



/**
 * Represents an actor created by `fromTransition`.
 *
 * The type of `self` within the actor's logic.
 *
 * @example
 *
 * ```ts
 * import {
 *   fromTransition,
 *   createActor,
 *   type AnyActorSystem
 * } from 'xstate';
 *
 * //* The actor's stored context.
 * type Context = {
 *   // The current count.
 *   count: number;
 *   // The amount to increase `count` by.
 *   step: number;
 * };
 * // The events the actor receives.
 * type Event = { type: 'increment' };
 * // The actor's input.
 * type Input = { step?: number };
 *
 * // Actor logic that increments `count` by `step` when it receives an event of
 * // type `increment`.
 * const logic = fromTransition<Context, Event, AnyActorSystem, Input>(
 *   (state, event, actorScope) => {
 *     actorScope.self;
 *     //         ^? TransitionActorRef<Context, Event>
 *
 *     if (event.type === 'increment') {
 *       return {
 *         ...state,
 *         count: state.count + state.step
 *       };
 *     }
 *     return state;
 *   },
 *   ({ input, self }) => {
 *     self;
 *     // ^? TransitionActorRef<Context, Event>
 *
 *     return {
 *       count: 0,
 *       step: input.step ?? 1
 *     };
 *   }
 * );
 *
 * const actor = createActor(logic, { input: { step: 10 } });
 * //    ^? TransitionActorRef<Context, Event>
 * ```
 *
 * @see {@link fromTransition}
 */

/**
 * Returns actor logic given a transition function and its initial state.
 *
 * A “transition function” is a function that takes the current `state` and
 * received `event` object as arguments, and returns the next state, similar to
 * a reducer.
 *
 * Actors created from transition logic (“transition actors”) can:
 *
 * - Receive events
 * - Emit snapshots of its state
 *
 * The transition function’s `state` is used as its transition actor’s
 * `context`.
 *
 * Note that the "state" for a transition function is provided by the initial
 * state argument, and is not the same as the State object of an actor or a
 * state within a machine configuration.
 *
 * @example
 *
 * ```ts
 * const transitionLogic = fromTransition(
 *   (state, event) => {
 *     if (event.type === 'increment') {
 *       return {
 *         ...state,
 *         count: state.count + 1
 *       };
 *     }
 *     return state;
 *   },
 *   { count: 0 }
 * );
 *
 * const transitionActor = createActor(transitionLogic);
 * transitionActor.subscribe((snapshot) => {
 *   console.log(snapshot);
 * });
 * transitionActor.start();
 * // => {
 * //   status: 'active',
 * //   context: { count: 0 },
 * //   ...
 * // }
 *
 * transitionActor.send({ type: 'increment' });
 * // => {
 * //   status: 'active',
 * //   context: { count: 1 },
 * //   ...
 * // }
 * ```
 *
 * @param transition The transition function used to describe the transition
 *   logic. It should return the next state given the current state and event.
 *   It receives the following arguments:
 *
 *   - `state` - the current state.
 *   - `event` - the received event.
 *   - `actorScope` - the actor scope object, with properties like `self` and
 *       `system`.
 *
 * @param initialContext The initial state of the transition function, either an
 *   object representing the state, or a function which returns a state object.
 *   If a function, it will receive as its only argument an object with the
 *   following properties:
 *
 *   - `input` - the `input` provided to its parent transition actor.
 *   - `self` - a reference to its parent transition actor.
 *
 * @returns Actor logic
 * @see {@link https://stately.ai/docs/input | Input docs} for more information about how input is passed
 */
function fromTransition(transition, initialContext) {
  return {
    config: transition,
    transition: (snapshot, event, actorScope) => {
      return {
        ...snapshot,
        context: transition(snapshot.context, event, actorScope)
      };
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: 'active',
        output: undefined,
        error: undefined,
        context: typeof initialContext === 'function' ? initialContext({
          input
        }) : initialContext
      };
    },
    getPersistedSnapshot: snapshot => snapshot,
    restoreSnapshot: snapshot => snapshot
  };
}

const instanceStates = /* #__PURE__ */new WeakMap();

/**
 * Represents an actor created by `fromCallback`.
 *
 * The type of `self` within the actor's logic.
 *
 * @example
 *
 * ```ts
 * import { fromCallback, createActor } from 'xstate';
 *
 * // The events the actor receives.
 * type Event = { type: 'someEvent' };
 * // The actor's input.
 * type Input = { name: string };
 *
 * // Actor logic that logs whenever it receives an event of type `someEvent`.
 * const logic = fromCallback<Event, Input>(({ self, input, receive }) => {
 *   self;
 *   // ^? CallbackActorRef<Event, Input>
 *
 *   receive((event) => {
 *     if (event.type === 'someEvent') {
 *       console.log(`${input.name}: received "someEvent" event`);
 *       // logs 'myActor: received "someEvent" event'
 *     }
 *   });
 * });
 *
 * const actor = createActor(logic, { input: { name: 'myActor' } });
 * //    ^? CallbackActorRef<Event, Input>
 * ```
 *
 * @see {@link fromCallback}
 */

/**
 * An actor logic creator which returns callback logic as defined by a callback
 * function.
 *
 * @remarks
 * Useful for subscription-based or other free-form logic that can send events
 * back to the parent actor.
 *
 * Actors created from callback logic (“callback actors”) can:
 *
 * - Receive events via the `receive` function
 * - Send events to the parent actor via the `sendBack` function
 *
 * Callback actors are a bit different from other actors in that they:
 *
 * - Do not work with `onDone`
 * - Do not produce a snapshot using `.getSnapshot()`
 * - Do not emit values when used with `.subscribe()`
 * - Can not be stopped with `.stop()`
 *
 * @example
 *
 * ```typescript
 * const callbackLogic = fromCallback(({ sendBack, receive }) => {
 *   let lockStatus = 'unlocked';
 *
 *   const handler = (event) => {
 *     if (lockStatus === 'locked') {
 *       return;
 *     }
 *     sendBack(event);
 *   };
 *
 *   receive((event) => {
 *     if (event.type === 'lock') {
 *       lockStatus = 'locked';
 *     } else if (event.type === 'unlock') {
 *       lockStatus = 'unlocked';
 *     }
 *   });
 *
 *   document.body.addEventListener('click', handler);
 *
 *   return () => {
 *     document.body.removeEventListener('click', handler);
 *   };
 * });
 * ```
 *
 * @param invokeCallback - The callback function used to describe the callback
 *   logic The callback function is passed an object with the following
 *   properties:
 *
 *   - `receive` - A function that can send events back to the parent actor; the
 *       listener is then called whenever events are received by the callback
 *       actor
 *   - `sendBack` - A function that can send events back to the parent actor
 *   - `input` - Data that was provided to the callback actor
 *   - `self` - The parent actor of the callback actor
 *   - `system` - The actor system to which the callback actor belongs The callback
 *       function can (optionally) return a cleanup function, which is called
 *       when the actor is stopped.
 *
 * @returns Callback logic
 * @see {@link InvokeCallback} for more information about the callback function and its object argument
 * @see {@link https://stately.ai/docs/input | Input docs} for more information about how input is passed
 */
function fromCallback(invokeCallback) {
  const logic = {
    config: invokeCallback,
    start: (state, actorScope) => {
      const {
        self,
        system,
        emit
      } = actorScope;
      const callbackState = {
        receivers: undefined,
        dispose: undefined
      };
      instanceStates.set(self, callbackState);
      callbackState.dispose = invokeCallback({
        input: state.input,
        system,
        self,
        sendBack: event => {
          if (self.getSnapshot().status === 'stopped') {
            return;
          }
          if (self._parent) {
            system._relay(self, self._parent, event);
          }
        },
        receive: listener => {
          callbackState.receivers ??= new Set();
          callbackState.receivers.add(listener);
        },
        emit
      });
    },
    transition: (state, event, actorScope) => {
      const callbackState = instanceStates.get(actorScope.self);
      if (event.type === XSTATE_STOP) {
        state = {
          ...state,
          status: 'stopped',
          error: undefined
        };
        callbackState.dispose?.();
        return state;
      }
      callbackState.receivers?.forEach(receiver => receiver(event));
      return state;
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: 'active',
        output: undefined,
        error: undefined,
        input
      };
    },
    getPersistedSnapshot: snapshot => snapshot,
    restoreSnapshot: snapshot => snapshot
  };
  return logic;
}

const XSTATE_OBSERVABLE_NEXT = 'xstate.observable.next';
const XSTATE_OBSERVABLE_ERROR = 'xstate.observable.error';
const XSTATE_OBSERVABLE_COMPLETE = 'xstate.observable.complete';

/**
 * Represents an actor created by `fromObservable` or `fromEventObservable`.
 *
 * The type of `self` within the actor's logic.
 *
 * @example
 *
 * ```ts
 * import { fromObservable, createActor } from 'xstate';
 * import { interval } from 'rxjs';
 *
 * // The type of the value observed by the actor's logic.
 * type Context = number;
 * // The actor's input.
 * type Input = { period?: number };
 *
 * // Actor logic that observes a number incremented every `input.period`
 * // milliseconds (default: 1_000).
 * const logic = fromObservable<Context, Input>(({ input, self }) => {
 *   self;
 *   // ^? ObservableActorRef<Event, Input>
 *
 *   return interval(input.period ?? 1_000);
 * });
 *
 * const actor = createActor(logic, { input: { period: 2_000 } });
 * //    ^? ObservableActorRef<Event, Input>
 * ```
 *
 * @see {@link fromObservable}
 * @see {@link fromEventObservable}
 */

/**
 * Observable actor logic is described by an observable stream of values. Actors
 * created from observable logic (“observable actors”) can:
 *
 * - Emit snapshots of the observable’s emitted value
 *
 * The observable’s emitted value is used as its observable actor’s `context`.
 *
 * Sending events to observable actors will have no effect.
 *
 * @example
 *
 * ```ts
 * import { fromObservable, createActor } from 'xstate';
 * import { interval } from 'rxjs';
 *
 * const logic = fromObservable((obj) => interval(1000));
 *
 * const actor = createActor(logic);
 *
 * actor.subscribe((snapshot) => {
 *   console.log(snapshot.context);
 * });
 *
 * actor.start();
 * // At every second:
 * // Logs 0
 * // Logs 1
 * // Logs 2
 * // ...
 * ```
 *
 * @param observableCreator A function that creates an observable. It receives
 *   one argument, an object with the following properties:
 *
 *   - `input` - Data that was provided to the observable actor
 *   - `self` - The parent actor
 *   - `system` - The actor system to which the observable actor belongs
 *
 *   It should return a {@link Subscribable}, which is compatible with an RxJS
 *   Observable, although RxJS is not required to create them.
 * @see {@link https://rxjs.dev} for documentation on RxJS Observable and observable creators.
 * @see {@link Subscribable} interface in XState, which is based on and compatible with RxJS Observable.
 */
function fromObservable(observableCreator) {
  // TODO: add event types
  const logic = {
    config: observableCreator,
    transition: (snapshot, event) => {
      if (snapshot.status !== 'active') {
        return snapshot;
      }
      switch (event.type) {
        case XSTATE_OBSERVABLE_NEXT:
          {
            const newSnapshot = {
              ...snapshot,
              context: event.data
            };
            return newSnapshot;
          }
        case XSTATE_OBSERVABLE_ERROR:
          return {
            ...snapshot,
            status: 'error',
            error: event.data,
            input: undefined,
            _subscription: undefined
          };
        case XSTATE_OBSERVABLE_COMPLETE:
          return {
            ...snapshot,
            status: 'done',
            input: undefined,
            _subscription: undefined
          };
        case XSTATE_STOP:
          snapshot._subscription.unsubscribe();
          return {
            ...snapshot,
            status: 'stopped',
            input: undefined,
            _subscription: undefined
          };
        default:
          return snapshot;
      }
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: 'active',
        output: undefined,
        error: undefined,
        context: undefined,
        input,
        _subscription: undefined
      };
    },
    start: (state, {
      self,
      system,
      emit
    }) => {
      if (state.status === 'done') {
        // Do not restart a completed observable
        return;
      }
      state._subscription = observableCreator({
        input: state.input,
        system,
        self,
        emit
      }).subscribe({
        next: value => {
          system._relay(self, self, {
            type: XSTATE_OBSERVABLE_NEXT,
            data: value
          });
        },
        error: err => {
          system._relay(self, self, {
            type: XSTATE_OBSERVABLE_ERROR,
            data: err
          });
        },
        complete: () => {
          system._relay(self, self, {
            type: XSTATE_OBSERVABLE_COMPLETE
          });
        }
      });
    },
    getPersistedSnapshot: ({
      _subscription,
      ...state
    }) => state,
    restoreSnapshot: state => ({
      ...state,
      _subscription: undefined
    })
  };
  return logic;
}

/**
 * Creates event observable logic that listens to an observable that delivers
 * event objects.
 *
 * Event observable actor logic is described by an observable stream of
 * {@link https://stately.ai/docs/transitions#event-objects | event objects}.
 * Actors created from event observable logic (“event observable actors”) can:
 *
 * - Implicitly send events to its parent actor
 * - Emit snapshots of its emitted event objects
 *
 * Sending events to event observable actors will have no effect.
 *
 * @example
 *
 * ```ts
 * import {
 *   fromEventObservable,
 *   Subscribable,
 *   EventObject,
 *   createMachine,
 *   createActor
 * } from 'xstate';
 * import { fromEvent } from 'rxjs';
 *
 * const mouseClickLogic = fromEventObservable(
 *   () => fromEvent(document.body, 'click') as Subscribable<EventObject>
 * );
 *
 * const canvasMachine = createMachine({
 *   invoke: {
 *     // Will send mouse `click` events to the canvas actor
 *     src: mouseClickLogic
 *   }
 * });
 *
 * const canvasActor = createActor(canvasMachine);
 * canvasActor.start();
 * ```
 *
 * @param lazyObservable A function that creates an observable that delivers
 *   event objects. It receives one argument, an object with the following
 *   properties:
 *
 *   - `input` - Data that was provided to the event observable actor
 *   - `self` - The parent actor
 *   - `system` - The actor system to which the event observable actor belongs.
 *
 *   It should return a {@link Subscribable}, which is compatible with an RxJS
 *   Observable, although RxJS is not required to create them.
 */
function fromEventObservable(lazyObservable) {
  // TODO: event types
  const logic = {
    config: lazyObservable,
    transition: (state, event) => {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case XSTATE_OBSERVABLE_ERROR:
          return {
            ...state,
            status: 'error',
            error: event.data,
            input: undefined,
            _subscription: undefined
          };
        case XSTATE_OBSERVABLE_COMPLETE:
          return {
            ...state,
            status: 'done',
            input: undefined,
            _subscription: undefined
          };
        case XSTATE_STOP:
          state._subscription.unsubscribe();
          return {
            ...state,
            status: 'stopped',
            input: undefined,
            _subscription: undefined
          };
        default:
          return state;
      }
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: 'active',
        output: undefined,
        error: undefined,
        context: undefined,
        input,
        _subscription: undefined
      };
    },
    start: (state, {
      self,
      system,
      emit
    }) => {
      if (state.status === 'done') {
        // Do not restart a completed observable
        return;
      }
      state._subscription = lazyObservable({
        input: state.input,
        system,
        self,
        emit
      }).subscribe({
        next: value => {
          if (self._parent) {
            system._relay(self, self._parent, value);
          }
        },
        error: err => {
          system._relay(self, self, {
            type: XSTATE_OBSERVABLE_ERROR,
            data: err
          });
        },
        complete: () => {
          system._relay(self, self, {
            type: XSTATE_OBSERVABLE_COMPLETE
          });
        }
      });
    },
    getPersistedSnapshot: ({
      _subscription,
      ...snapshot
    }) => snapshot,
    restoreSnapshot: snapshot => ({
      ...snapshot,
      _subscription: undefined
    })
  };
  return logic;
}

const XSTATE_PROMISE_RESOLVE = 'xstate.promise.resolve';
const XSTATE_PROMISE_REJECT = 'xstate.promise.reject';

/**
 * Represents an actor created by `fromPromise`.
 *
 * The type of `self` within the actor's logic.
 *
 * @example
 *
 * ```ts
 * import { fromPromise, createActor } from 'xstate';
 *
 * // The actor's resolved output
 * type Output = string;
 * // The actor's input.
 * type Input = { message: string };
 *
 * // Actor logic that fetches the url of an image of a cat saying `input.message`.
 * const logic = fromPromise<Output, Input>(async ({ input, self }) => {
 *   self;
 *   // ^? PromiseActorRef<Output, Input>
 *
 *   const data = await fetch(
 *     `https://cataas.com/cat/says/${input.message}`
 *   );
 *   const url = await data.json();
 *   return url;
 * });
 *
 * const actor = createActor(logic, { input: { message: 'hello world' } });
 * //    ^? PromiseActorRef<Output, Input>
 * ```
 *
 * @see {@link fromPromise}
 */

const controllerMap = new WeakMap();

/**
 * An actor logic creator which returns promise logic as defined by an async
 * process that resolves or rejects after some time.
 *
 * Actors created from promise actor logic (“promise actors”) can:
 *
 * - Emit the resolved value of the promise
 * - Output the resolved value of the promise
 *
 * Sending events to promise actors will have no effect.
 *
 * @example
 *
 * ```ts
 * const promiseLogic = fromPromise(async () => {
 *   const result = await fetch('https://example.com/...').then((data) =>
 *     data.json()
 *   );
 *
 *   return result;
 * });
 *
 * const promiseActor = createActor(promiseLogic);
 * promiseActor.subscribe((snapshot) => {
 *   console.log(snapshot);
 * });
 * promiseActor.start();
 * // => {
 * //   output: undefined,
 * //   status: 'active'
 * //   ...
 * // }
 *
 * // After promise resolves
 * // => {
 * //   output: { ... },
 * //   status: 'done',
 * //   ...
 * // }
 * ```
 *
 * @param promiseCreator A function which returns a Promise, and accepts an
 *   object with the following properties:
 *
 *   - `input` - Data that was provided to the promise actor
 *   - `self` - The parent actor of the promise actor
 *   - `system` - The actor system to which the promise actor belongs
 *
 * @see {@link https://stately.ai/docs/input | Input docs} for more information about how input is passed
 */
function fromPromise(promiseCreator) {
  const logic = {
    config: promiseCreator,
    transition: (state, event, scope) => {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case XSTATE_PROMISE_RESOLVE:
          {
            const resolvedValue = event.data;
            return {
              ...state,
              status: 'done',
              output: resolvedValue,
              input: undefined
            };
          }
        case XSTATE_PROMISE_REJECT:
          return {
            ...state,
            status: 'error',
            error: event.data,
            input: undefined
          };
        case _dist_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__.X:
          {
            controllerMap.get(scope.self)?.abort();
            return {
              ...state,
              status: 'stopped',
              input: undefined
            };
          }
        default:
          return state;
      }
    },
    start: (state, {
      self,
      system,
      emit
    }) => {
      // TODO: determine how to allow customizing this so that promises
      // can be restarted if necessary
      if (state.status !== 'active') {
        return;
      }
      const controller = new AbortController();
      controllerMap.set(self, controller);
      const resolvedPromise = Promise.resolve(promiseCreator({
        input: state.input,
        system,
        self,
        signal: controller.signal,
        emit
      }));
      resolvedPromise.then(response => {
        if (self.getSnapshot().status !== 'active') {
          return;
        }
        controllerMap.delete(self);
        system._relay(self, self, {
          type: XSTATE_PROMISE_RESOLVE,
          data: response
        });
      }, errorData => {
        if (self.getSnapshot().status !== 'active') {
          return;
        }
        controllerMap.delete(self);
        system._relay(self, self, {
          type: XSTATE_PROMISE_REJECT,
          data: errorData
        });
      });
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: 'active',
        output: undefined,
        error: undefined,
        input
      };
    },
    getPersistedSnapshot: snapshot => snapshot,
    restoreSnapshot: snapshot => snapshot
  };
  return logic;
}

const emptyLogic = fromTransition(_ => undefined, undefined);
function createEmptyActor() {
  return createActor(emptyLogic);
}




/***/ }),

/***/ 41570:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  $: () => (/* binding */ $$ACTOR_TYPE),
  A: () => (/* binding */ createActor),
  N: () => (/* binding */ NULL_EVENT),
  S: () => (/* binding */ STATE_DELIMITER),
  T: () => (/* binding */ ProcessingStatus),
  U: () => (/* binding */ cloneMachineSnapshot),
  X: () => (/* binding */ XSTATE_STOP),
  a: () => (/* binding */ toTransitionConfigArray),
  b: () => (/* binding */ formatTransition),
  c: () => (/* binding */ createInvokeId),
  d: () => (/* binding */ formatInitialTransition),
  e: () => (/* binding */ evaluateGuard),
  f: () => (/* binding */ formatTransitions),
  g: () => (/* binding */ getDelayedTransitions),
  h: () => (/* binding */ getCandidates),
  i: () => (/* binding */ getAllStateNodes),
  j: () => (/* binding */ getStateNodes),
  k: () => (/* binding */ createMachineSnapshot),
  l: () => (/* binding */ isInFinalState),
  m: () => (/* binding */ mapValues),
  n: () => (/* binding */ macrostep),
  o: () => (/* binding */ transitionNode),
  p: () => (/* binding */ resolveActionsAndContext),
  q: () => (/* binding */ createInitEvent),
  r: () => (/* binding */ resolveStateValue),
  s: () => (/* binding */ microstep),
  t: () => (/* binding */ toArray),
  u: () => (/* binding */ getInitialStateNodes),
  v: () => (/* binding */ toStatePath),
  w: () => (/* binding */ isStateId),
  x: () => (/* binding */ getStateNodeByPath),
  y: () => (/* binding */ getPersistedSnapshot),
  z: () => (/* binding */ resolveReferencedActor)
});

// UNUSED EXPORTS: B, C, D, E, F, G, H, I, J, K, L, M, O, P, Q, R, V, W

;// CONCATENATED MODULE: ./node_modules/xstate/dev/dist/xstate-dev.esm.js
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof __webpack_require__.g !== 'undefined') {
    return __webpack_require__.g;
  }
}
function getDevTools() {
  const w = getGlobal();
  if (!!w.__xstate__) {
    return w.__xstate__;
  }
  return undefined;
}
function registerService(service) {
  if (typeof window === 'undefined') {
    return;
  }
  const devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
}
const devToolsAdapter = service => {
  if (typeof window === 'undefined') {
    return;
  }
  const devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
};



;// CONCATENATED MODULE: ./node_modules/xstate/dist/State-cdbc7940.esm.js


class Mailbox {
  constructor(_process) {
    this._process = _process;
    this._active = false;
    this._current = null;
    this._last = null;
  }
  start() {
    this._active = true;
    this.flush();
  }
  clear() {
    // we can't set _current to null because we might be currently processing
    // and enqueue following clear shouldnt start processing the enqueued item immediately
    if (this._current) {
      this._current.next = null;
      this._last = this._current;
    }
  }
  enqueue(event) {
    const enqueued = {
      value: event,
      next: null
    };
    if (this._current) {
      this._last.next = enqueued;
      this._last = enqueued;
      return;
    }
    this._current = enqueued;
    this._last = enqueued;
    if (this._active) {
      this.flush();
    }
  }
  flush() {
    while (this._current) {
      // atm the given _process is responsible for implementing proper try/catch handling
      // we assume here that this won't throw in a way that can affect this mailbox
      const consumed = this._current;
      this._process(consumed.value);
      this._current = consumed.next;
    }
    this._last = null;
  }
}

const STATE_DELIMITER = '.';
const TARGETLESS_KEY = '';
const NULL_EVENT = '';
const STATE_IDENTIFIER = '#';
const WILDCARD = '*';
const XSTATE_INIT = 'xstate.init';
const XSTATE_ERROR = 'xstate.error';
const XSTATE_STOP = 'xstate.stop';

/**
 * Returns an event that represents an implicit event that is sent after the
 * specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */
function createAfterEvent(delayRef, id) {
  return {
    type: `xstate.after.${delayRef}.${id}`
  };
}

/**
 * Returns an event that represents that a final state node has been reached in
 * the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param output The data to pass into the event
 */
function createDoneStateEvent(id, output) {
  return {
    type: `xstate.done.state.${id}`,
    output
  };
}

/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state
 * node, but not when it is canceled.
 *
 * @param invokeId The invoked service ID
 * @param output The data to pass into the event
 */
function createDoneActorEvent(invokeId, output) {
  return {
    type: `xstate.done.actor.${invokeId}`,
    output,
    actorId: invokeId
  };
}
function createErrorActorEvent(id, error) {
  return {
    type: `xstate.error.actor.${id}`,
    error,
    actorId: id
  };
}
function createInitEvent(input) {
  return {
    type: XSTATE_INIT,
    input
  };
}

/**
 * This function makes sure that unhandled errors are thrown in a separate
 * macrotask. It allows those errors to be detected by global error handlers and
 * reported to bug tracking services without interrupting our own stack of
 * execution.
 *
 * @param err Error to be thrown
 */
function reportUnhandledError(err) {
  setTimeout(() => {
    throw err;
  });
}

const symbolObservable = (() => typeof Symbol === 'function' && Symbol.observable || '@@observable')();

function matchesState(parentStateId, childStateId) {
  const parentStateValue = toStateValue(parentStateId);
  const childStateValue = toStateValue(childStateId);
  if (typeof childStateValue === 'string') {
    if (typeof parentStateValue === 'string') {
      return childStateValue === parentStateValue;
    }

    // Parent more specific than child
    return false;
  }
  if (typeof parentStateValue === 'string') {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every(key => {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function toStatePath(stateId) {
  if (isArray(stateId)) {
    return stateId;
  }
  let result = [];
  let segment = '';
  for (let i = 0; i < stateId.length; i++) {
    const char = stateId.charCodeAt(i);
    switch (char) {
      // \
      case 92:
        // consume the next character
        segment += stateId[i + 1];
        // and skip over it
        i++;
        continue;
      // .
      case 46:
        result.push(segment);
        segment = '';
        continue;
    }
    segment += stateId[i];
  }
  result.push(segment);
  return result;
}
function toStateValue(stateValue) {
  if (isMachineSnapshot(stateValue)) {
    return stateValue.value;
  }
  if (typeof stateValue !== 'string') {
    return stateValue;
  }
  const statePath = toStatePath(stateValue);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  const value = {};
  let marker = value;
  for (let i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      const previous = marker;
      marker = {};
      previous[statePath[i]] = marker;
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  const result = {};
  const collectionKeys = Object.keys(collection);
  for (let i = 0; i < collectionKeys.length; i++) {
    const key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }
  return result;
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }
  return [value];
}
function toArray(value) {
  if (value === undefined) {
    return [];
  }
  return toArrayStrict(value);
}
function resolveOutput(mapper, context, event, self) {
  if (typeof mapper === 'function') {
    return mapper({
      context,
      event,
      self
    });
  }
  return mapper;
}
function isArray(value) {
  return Array.isArray(value);
}
function isErrorActorEvent(event) {
  return event.type.startsWith('xstate.error.actor');
}
function toTransitionConfigArray(configLike) {
  return toArrayStrict(configLike).map(transitionLike => {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string') {
      return {
        target: transitionLike
      };
    }
    return transitionLike;
  });
}
function normalizeTarget(target) {
  if (target === undefined || target === TARGETLESS_KEY) {
    return undefined;
  }
  return toArray(target);
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  const isObserver = typeof nextHandler === 'object';
  const self = isObserver ? nextHandler : undefined;
  return {
    next: (isObserver ? nextHandler.next : nextHandler)?.bind(self),
    error: (isObserver ? nextHandler.error : errorHandler)?.bind(self),
    complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return `${index}.${stateNodeId}`;
}
function resolveReferencedActor(machine, src) {
  const match = src.match(/^xstate\.invoke\.(\d+)\.(.*)/);
  if (!match) {
    return machine.implementations.actors[src];
  }
  const [, indexStr, nodeId] = match;
  const node = machine.getStateNodeById(nodeId);
  const invokeConfig = node.config.invoke;
  return (Array.isArray(invokeConfig) ? invokeConfig[indexStr] : invokeConfig).src;
}
function getAllOwnEventDescriptors(snapshot) {
  return [...new Set([...snapshot._nodes.flatMap(sn => sn.ownEvents)])];
}

function createScheduledEventId(actorRef, id) {
  return `${actorRef.sessionId}.${id}`;
}
let idCounter = 0;
function createSystem(rootActor, options) {
  const children = new Map();
  const keyedActors = new Map();
  const reverseKeyedActors = new WeakMap();
  const inspectionObservers = new Set();
  const timerMap = {};
  const {
    clock,
    logger
  } = options;
  const scheduler = {
    schedule: (source, target, event, delay, id = Math.random().toString(36).slice(2)) => {
      const scheduledEvent = {
        source,
        target,
        event,
        delay,
        id,
        startedAt: Date.now()
      };
      const scheduledEventId = createScheduledEventId(source, id);
      system._snapshot._scheduledEvents[scheduledEventId] = scheduledEvent;
      const timeout = clock.setTimeout(() => {
        delete timerMap[scheduledEventId];
        delete system._snapshot._scheduledEvents[scheduledEventId];
        system._relay(source, target, event);
      }, delay);
      timerMap[scheduledEventId] = timeout;
    },
    cancel: (source, id) => {
      const scheduledEventId = createScheduledEventId(source, id);
      const timeout = timerMap[scheduledEventId];
      delete timerMap[scheduledEventId];
      delete system._snapshot._scheduledEvents[scheduledEventId];
      if (timeout !== undefined) {
        clock.clearTimeout(timeout);
      }
    },
    cancelAll: actorRef => {
      for (const scheduledEventId in system._snapshot._scheduledEvents) {
        const scheduledEvent = system._snapshot._scheduledEvents[scheduledEventId];
        if (scheduledEvent.source === actorRef) {
          scheduler.cancel(actorRef, scheduledEvent.id);
        }
      }
    }
  };
  const sendInspectionEvent = event => {
    if (!inspectionObservers.size) {
      return;
    }
    const resolvedInspectionEvent = {
      ...event,
      rootId: rootActor.sessionId
    };
    inspectionObservers.forEach(observer => observer.next?.(resolvedInspectionEvent));
  };
  const system = {
    _snapshot: {
      _scheduledEvents: (options?.snapshot && options.snapshot.scheduler) ?? {}
    },
    _bookId: () => `x:${idCounter++}`,
    _register: (sessionId, actorRef) => {
      children.set(sessionId, actorRef);
      return sessionId;
    },
    _unregister: actorRef => {
      children.delete(actorRef.sessionId);
      const systemId = reverseKeyedActors.get(actorRef);
      if (systemId !== undefined) {
        keyedActors.delete(systemId);
        reverseKeyedActors.delete(actorRef);
      }
    },
    get: systemId => {
      return keyedActors.get(systemId);
    },
    _set: (systemId, actorRef) => {
      const existing = keyedActors.get(systemId);
      if (existing && existing !== actorRef) {
        throw new Error(`Actor with system ID '${systemId}' already exists.`);
      }
      keyedActors.set(systemId, actorRef);
      reverseKeyedActors.set(actorRef, systemId);
    },
    inspect: observerOrFn => {
      const observer = toObserver(observerOrFn);
      inspectionObservers.add(observer);
      return {
        unsubscribe() {
          inspectionObservers.delete(observer);
        }
      };
    },
    _sendInspectionEvent: sendInspectionEvent,
    _relay: (source, target, event) => {
      system._sendInspectionEvent({
        type: '@xstate.event',
        sourceRef: source,
        actorRef: target,
        event
      });
      target._send(event);
    },
    scheduler,
    getSnapshot: () => {
      return {
        _scheduledEvents: {
          ...system._snapshot._scheduledEvents
        }
      };
    },
    start: () => {
      const scheduledEvents = system._snapshot._scheduledEvents;
      system._snapshot._scheduledEvents = {};
      for (const scheduledId in scheduledEvents) {
        const {
          source,
          target,
          event,
          delay,
          id
        } = scheduledEvents[scheduledId];
        scheduler.schedule(source, target, event, delay, id);
      }
    },
    _clock: clock,
    _logger: logger
  };
  return system;
}

const $$ACTOR_TYPE = 1;

// those values are currently used by @xstate/react directly so it's important to keep the assigned values in sync
let ProcessingStatus = /*#__PURE__*/function (ProcessingStatus) {
  ProcessingStatus[ProcessingStatus["NotStarted"] = 0] = "NotStarted";
  ProcessingStatus[ProcessingStatus["Running"] = 1] = "Running";
  ProcessingStatus[ProcessingStatus["Stopped"] = 2] = "Stopped";
  return ProcessingStatus;
}({});
const defaultOptions = {
  clock: {
    setTimeout: (fn, ms) => {
      return setTimeout(fn, ms);
    },
    clearTimeout: id => {
      return clearTimeout(id);
    }
  },
  logger: console.log.bind(console),
  devTools: false
};

/**
 * An Actor is a running process that can receive events, send events and change
 * its behavior based on the events it receives, which can cause effects outside
 * of the actor. When you run a state machine, it becomes an actor.
 */
class Actor {
  /**
   * Creates a new actor instance for the given logic with the provided options,
   * if any.
   *
   * @param logic The logic to create an actor from
   * @param options Actor options
   */
  constructor(logic, options) {
    this.logic = logic;
    /** The current internal state of the actor. */
    this._snapshot = void 0;
    /**
     * The clock that is responsible for setting and clearing timeouts, such as
     * delayed events and transitions.
     */
    this.clock = void 0;
    this.options = void 0;
    /** The unique identifier for this actor relative to its parent. */
    this.id = void 0;
    this.mailbox = new Mailbox(this._process.bind(this));
    this.observers = new Set();
    this.eventListeners = new Map();
    this.logger = void 0;
    /** @internal */
    this._processingStatus = ProcessingStatus.NotStarted;
    // Actor Ref
    this._parent = void 0;
    /** @internal */
    this._syncSnapshot = void 0;
    this.ref = void 0;
    // TODO: add typings for system
    this._actorScope = void 0;
    this._systemId = void 0;
    /** The globally unique process ID for this invocation. */
    this.sessionId = void 0;
    /** The system to which this actor belongs. */
    this.system = void 0;
    this._doneEvent = void 0;
    this.src = void 0;
    // array of functions to defer
    this._deferred = [];
    const resolvedOptions = {
      ...defaultOptions,
      ...options
    };
    const {
      clock,
      logger,
      parent,
      syncSnapshot,
      id,
      systemId,
      inspect
    } = resolvedOptions;
    this.system = parent ? parent.system : createSystem(this, {
      clock,
      logger
    });
    if (inspect && !parent) {
      // Always inspect at the system-level
      this.system.inspect(toObserver(inspect));
    }
    this.sessionId = this.system._bookId();
    this.id = id ?? this.sessionId;
    this.logger = options?.logger ?? this.system._logger;
    this.clock = options?.clock ?? this.system._clock;
    this._parent = parent;
    this._syncSnapshot = syncSnapshot;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src ?? logic;
    this.ref = this;
    this._actorScope = {
      self: this,
      id: this.id,
      sessionId: this.sessionId,
      logger: this.logger,
      defer: fn => {
        this._deferred.push(fn);
      },
      system: this.system,
      stopChild: child => {
        if (child._parent !== this) {
          throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
        }
        child._stop();
      },
      emit: emittedEvent => {
        const listeners = this.eventListeners.get(emittedEvent.type);
        const wildcardListener = this.eventListeners.get('*');
        if (!listeners && !wildcardListener) {
          return;
        }
        const allListeners = new Set([...(listeners ? listeners.values() : []), ...(wildcardListener ? wildcardListener.values() : [])]);
        for (const handler of Array.from(allListeners)) {
          handler(emittedEvent);
        }
      }
    };

    // Ensure that the send method is bound to this Actor instance
    // if destructured
    this.send = this.send.bind(this);
    this.system._sendInspectionEvent({
      type: '@xstate.actor',
      actorRef: this
    });
    if (systemId) {
      this._systemId = systemId;
      this.system._set(systemId, this);
    }
    this._initState(options?.snapshot ?? options?.state);
    if (systemId && this._snapshot.status !== 'active') {
      this.system._unregister(this);
    }
  }
  _initState(persistedState) {
    try {
      this._snapshot = persistedState ? this.logic.restoreSnapshot ? this.logic.restoreSnapshot(persistedState, this._actorScope) : persistedState : this.logic.getInitialSnapshot(this._actorScope, this.options?.input);
    } catch (err) {
      // if we get here then it means that we assign a value to this._snapshot that is not of the correct type
      // we can't get the true `TSnapshot & { status: 'error'; }`, it's impossible
      // so right now this is a lie of sorts
      this._snapshot = {
        status: 'error',
        output: undefined,
        error: err
      };
    }
  }
  update(snapshot, event) {
    // Update state
    this._snapshot = snapshot;

    // Execute deferred effects
    let deferredFn;
    while (deferredFn = this._deferred.shift()) {
      try {
        deferredFn();
      } catch (err) {
        // this error can only be caught when executing *initial* actions
        // it's the only time when we call actions provided by the user through those deferreds
        // when the actor is already running we always execute them synchronously while transitioning
        // no "builtin deferred" should actually throw an error since they are either safe
        // or the control flow is passed through the mailbox and errors should be caught by the `_process` used by the mailbox
        this._deferred.length = 0;
        this._snapshot = {
          ...snapshot,
          status: 'error',
          error: err
        };
      }
    }
    switch (this._snapshot.status) {
      case 'active':
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
        break;
      case 'done':
        // next observers are meant to be notified about done snapshots
        // this can be seen as something that is different from how observable work
        // but with observables `complete` callback is called without any arguments
        // it's more ergonomic for XState to treat a done snapshot as a "next" value
        // and the completion event as something that is separate,
        // something that merely follows emitting that done snapshot
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
        this._stopProcedure();
        this._complete();
        this._doneEvent = createDoneActorEvent(this.id, this._snapshot.output);
        if (this._parent) {
          this.system._relay(this, this._parent, this._doneEvent);
        }
        break;
      case 'error':
        this._error(this._snapshot.error);
        break;
    }
    this.system._sendInspectionEvent({
      type: '@xstate.snapshot',
      actorRef: this,
      event,
      snapshot
    });
  }

  /**
   * Subscribe an observer to an actor’s snapshot values.
   *
   * @remarks
   * The observer will receive the actor’s snapshot value when it is emitted.
   * The observer can be:
   *
   * - A plain function that receives the latest snapshot, or
   * - An observer object whose `.next(snapshot)` method receives the latest
   *   snapshot
   *
   * @example
   *
   * ```ts
   * // Observer as a plain function
   * const subscription = actor.subscribe((snapshot) => {
   *   console.log(snapshot);
   * });
   * ```
   *
   * @example
   *
   * ```ts
   * // Observer as an object
   * const subscription = actor.subscribe({
   *   next(snapshot) {
   *     console.log(snapshot);
   *   },
   *   error(err) {
   *     // ...
   *   },
   *   complete() {
   *     // ...
   *   }
   * });
   * ```
   *
   * The return value of `actor.subscribe(observer)` is a subscription object
   * that has an `.unsubscribe()` method. You can call
   * `subscription.unsubscribe()` to unsubscribe the observer:
   *
   * @example
   *
   * ```ts
   * const subscription = actor.subscribe((snapshot) => {
   *   // ...
   * });
   *
   * // Unsubscribe the observer
   * subscription.unsubscribe();
   * ```
   *
   * When the actor is stopped, all of its observers will automatically be
   * unsubscribed.
   *
   * @param observer - Either a plain function that receives the latest
   *   snapshot, or an observer object whose `.next(snapshot)` method receives
   *   the latest snapshot
   */

  subscribe(nextListenerOrObserver, errorListener, completeListener) {
    const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
    if (this._processingStatus !== ProcessingStatus.Stopped) {
      this.observers.add(observer);
    } else {
      switch (this._snapshot.status) {
        case 'done':
          try {
            observer.complete?.();
          } catch (err) {
            reportUnhandledError(err);
          }
          break;
        case 'error':
          {
            const err = this._snapshot.error;
            if (!observer.error) {
              reportUnhandledError(err);
            } else {
              try {
                observer.error(err);
              } catch (err) {
                reportUnhandledError(err);
              }
            }
            break;
          }
      }
    }
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }
  on(type, handler) {
    let listeners = this.eventListeners.get(type);
    if (!listeners) {
      listeners = new Set();
      this.eventListeners.set(type, listeners);
    }
    const wrappedHandler = handler.bind(undefined);
    listeners.add(wrappedHandler);
    return {
      unsubscribe: () => {
        listeners.delete(wrappedHandler);
      }
    };
  }

  /** Starts the Actor from the initial state */
  start() {
    if (this._processingStatus === ProcessingStatus.Running) {
      // Do not restart the service if it is already started
      return this;
    }
    if (this._syncSnapshot) {
      this.subscribe({
        next: snapshot => {
          if (snapshot.status === 'active') {
            this.system._relay(this, this._parent, {
              type: `xstate.snapshot.${this.id}`,
              snapshot
            });
          }
        },
        error: () => {}
      });
    }
    this.system._register(this.sessionId, this);
    if (this._systemId) {
      this.system._set(this._systemId, this);
    }
    this._processingStatus = ProcessingStatus.Running;

    // TODO: this isn't correct when rehydrating
    const initEvent = createInitEvent(this.options.input);
    this.system._sendInspectionEvent({
      type: '@xstate.event',
      sourceRef: this._parent,
      actorRef: this,
      event: initEvent
    });
    const status = this._snapshot.status;
    switch (status) {
      case 'done':
        // a state machine can be "done" upon initialization (it could reach a final state using initial microsteps)
        // we still need to complete observers, flush deferreds etc
        this.update(this._snapshot, initEvent);
        // TODO: rethink cleanup of observers, mailbox, etc
        return this;
      case 'error':
        this._error(this._snapshot.error);
        return this;
    }
    if (!this._parent) {
      this.system.start();
    }
    if (this.logic.start) {
      try {
        this.logic.start(this._snapshot, this._actorScope);
      } catch (err) {
        this._snapshot = {
          ...this._snapshot,
          status: 'error',
          error: err
        };
        this._error(err);
        return this;
      }
    }

    // TODO: this notifies all subscribers but usually this is redundant
    // there is no real change happening here
    // we need to rethink if this needs to be refactored
    this.update(this._snapshot, initEvent);
    if (this.options.devTools) {
      this.attachDevTools();
    }
    this.mailbox.start();
    return this;
  }
  _process(event) {
    let nextState;
    let caughtError;
    try {
      nextState = this.logic.transition(this._snapshot, event, this._actorScope);
    } catch (err) {
      // we wrap it in a box so we can rethrow it later even if falsy value gets caught here
      caughtError = {
        err
      };
    }
    if (caughtError) {
      const {
        err
      } = caughtError;
      this._snapshot = {
        ...this._snapshot,
        status: 'error',
        error: err
      };
      this._error(err);
      return;
    }
    this.update(nextState, event);
    if (event.type === XSTATE_STOP) {
      this._stopProcedure();
      this._complete();
    }
  }
  _stop() {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      return this;
    }
    this.mailbox.clear();
    if (this._processingStatus === ProcessingStatus.NotStarted) {
      this._processingStatus = ProcessingStatus.Stopped;
      return this;
    }
    this.mailbox.enqueue({
      type: XSTATE_STOP
    });
    return this;
  }

  /** Stops the Actor and unsubscribe all listeners. */
  stop() {
    if (this._parent) {
      throw new Error('A non-root actor cannot be stopped directly.');
    }
    return this._stop();
  }
  _complete() {
    for (const observer of this.observers) {
      try {
        observer.complete?.();
      } catch (err) {
        reportUnhandledError(err);
      }
    }
    this.observers.clear();
  }
  _reportError(err) {
    if (!this.observers.size) {
      if (!this._parent) {
        reportUnhandledError(err);
      }
      return;
    }
    let reportError = false;
    for (const observer of this.observers) {
      const errorListener = observer.error;
      reportError ||= !errorListener;
      try {
        errorListener?.(err);
      } catch (err2) {
        reportUnhandledError(err2);
      }
    }
    this.observers.clear();
    if (reportError) {
      reportUnhandledError(err);
    }
  }
  _error(err) {
    this._stopProcedure();
    this._reportError(err);
    if (this._parent) {
      this.system._relay(this, this._parent, createErrorActorEvent(this.id, err));
    }
  }
  // TODO: atm children don't belong entirely to the actor so
  // in a way - it's not even super aware of them
  // so we can't stop them from here but we really should!
  // right now, they are being stopped within the machine's transition
  // but that could throw and leave us with "orphaned" active actors
  _stopProcedure() {
    if (this._processingStatus !== ProcessingStatus.Running) {
      // Actor already stopped; do nothing
      return this;
    }

    // Cancel all delayed events
    this.system.scheduler.cancelAll(this);

    // TODO: mailbox.reset
    this.mailbox.clear();
    // TODO: after `stop` we must prepare ourselves for receiving events again
    // events sent *after* stop signal must be queued
    // it seems like this should be the common behavior for all of our consumers
    // so perhaps this should be unified somehow for all of them
    this.mailbox = new Mailbox(this._process.bind(this));
    this._processingStatus = ProcessingStatus.Stopped;
    this.system._unregister(this);
    return this;
  }

  /** @internal */
  _send(event) {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      return;
    }
    this.mailbox.enqueue(event);
  }

  /**
   * Sends an event to the running Actor to trigger a transition.
   *
   * @param event The event to send
   */
  send(event) {
    this.system._relay(undefined, this, event);
  }
  attachDevTools() {
    const {
      devTools
    } = this.options;
    if (devTools) {
      const resolvedDevToolsAdapter = typeof devTools === 'function' ? devTools : devToolsAdapter;
      resolvedDevToolsAdapter(this);
    }
  }
  toJSON() {
    return {
      xstate$$type: $$ACTOR_TYPE,
      id: this.id
    };
  }

  /**
   * Obtain the internal state of the actor, which can be persisted.
   *
   * @remarks
   * The internal state can be persisted from any actor, not only machines.
   *
   * Note that the persisted state is not the same as the snapshot from
   * {@link Actor.getSnapshot}. Persisted state represents the internal state of
   * the actor, while snapshots represent the actor's last emitted value.
   *
   * Can be restored with {@link ActorOptions.state}
   * @see https://stately.ai/docs/persistence
   */

  getPersistedSnapshot(options) {
    return this.logic.getPersistedSnapshot(this._snapshot, options);
  }
  [symbolObservable]() {
    return this;
  }

  /**
   * Read an actor’s snapshot synchronously.
   *
   * @remarks
   * The snapshot represent an actor's last emitted value.
   *
   * When an actor receives an event, its internal state may change. An actor
   * may emit a snapshot when a state transition occurs.
   *
   * Note that some actors, such as callback actors generated with
   * `fromCallback`, will not emit snapshots.
   * @see {@link Actor.subscribe} to subscribe to an actor’s snapshot values.
   * @see {@link Actor.getPersistedSnapshot} to persist the internal state of an actor (which is more than just a snapshot).
   */
  getSnapshot() {
    return this._snapshot;
  }
}
/**
 * Creates a new actor instance for the given actor logic with the provided
 * options, if any.
 *
 * @remarks
 * When you create an actor from actor logic via `createActor(logic)`, you
 * implicitly create an actor system where the created actor is the root actor.
 * Any actors spawned from this root actor and its descendants are part of that
 * actor system.
 * @example
 *
 * ```ts
 * import { createActor } from 'xstate';
 * import { someActorLogic } from './someActorLogic.ts';
 *
 * // Creating the actor, which implicitly creates an actor system with itself as the root actor
 * const actor = createActor(someActorLogic);
 *
 * actor.subscribe((snapshot) => {
 *   console.log(snapshot);
 * });
 *
 * // Actors must be started by calling `actor.start()`, which will also start the actor system.
 * actor.start();
 *
 * // Actors can receive events
 * actor.send({ type: 'someEvent' });
 *
 * // You can stop root actors by calling `actor.stop()`, which will also stop the actor system and all actors in that system.
 * actor.stop();
 * ```
 *
 * @param logic - The actor logic to create an actor from. For a state machine
 *   actor logic creator, see {@link createMachine}. Other actor logic creators
 *   include {@link fromCallback}, {@link fromEventObservable},
 *   {@link fromObservable}, {@link fromPromise}, and {@link fromTransition}.
 * @param options - Actor options
 */
function createActor(logic, ...[options]) {
  return new Actor(logic, options);
}

/**
 * Creates a new Interpreter instance for the given machine with the provided
 * options, if any.
 *
 * @deprecated Use `createActor` instead
 * @alias
 */
const interpret = (/* unused pure expression or super */ null && (createActor));

/**
 * @deprecated Use `Actor` instead.
 * @alias
 */

function resolveCancel(_, snapshot, actionArgs, actionParams, {
  sendId
}) {
  const resolvedSendId = typeof sendId === 'function' ? sendId(actionArgs, actionParams) : sendId;
  return [snapshot, resolvedSendId];
}
function executeCancel(actorScope, resolvedSendId) {
  actorScope.defer(() => {
    actorScope.system.scheduler.cancel(actorScope.self, resolvedSendId);
  });
}
/**
 * Cancels a delayed `sendTo(...)` action that is waiting to be executed. The
 * canceled `sendTo(...)` action will not send its event or execute, unless the
 * `delay` has already elapsed before `cancel(...)` is called.
 *
 * @example
 *
 * ```ts
 * import { createMachine, sendTo, cancel } from 'xstate';
 *
 * const machine = createMachine({
 *   // ...
 *   on: {
 *     sendEvent: {
 *       actions: sendTo(
 *         'some-actor',
 *         { type: 'someEvent' },
 *         {
 *           id: 'some-id',
 *           delay: 1000
 *         }
 *       )
 *     },
 *     cancelEvent: {
 *       actions: cancel('some-id')
 *     }
 *   }
 * });
 * ```
 *
 * @param sendId The `id` of the `sendTo(...)` action to cancel.
 */
function cancel(sendId) {
  function cancel(args, params) {
  }
  cancel.type = 'xstate.cancel';
  cancel.sendId = sendId;
  cancel.resolve = resolveCancel;
  cancel.execute = executeCancel;
  return cancel;
}

function checkStateIn(snapshot, _, {
  stateValue
}) {
  if (typeof stateValue === 'string' && isStateId(stateValue)) {
    const target = snapshot.machine.getStateNodeById(stateValue);
    return snapshot._nodes.some(sn => sn === target);
  }
  return snapshot.matches(stateValue);
}
function stateIn(stateValue) {
  function stateIn(args, params) {
    return false;
  }
  stateIn.check = checkStateIn;
  stateIn.stateValue = stateValue;
  return stateIn;
}
function checkNot(snapshot, {
  context,
  event
}, {
  guards
}) {
  return !evaluateGuard(guards[0], context, event, snapshot);
}

/**
 * Higher-order guard that evaluates to `true` if the `guard` passed to it
 * evaluates to `false`.
 *
 * @category Guards
 * @example
 *
 * ```ts
 * import { setup, not } from 'xstate';
 *
 * const machine = setup({
 *   guards: {
 *     someNamedGuard: () => false
 *   }
 * }).createMachine({
 *   on: {
 *     someEvent: {
 *       guard: not('someNamedGuard'),
 *       actions: () => {
 *         // will be executed if guard in `not(...)`
 *         // evaluates to `false`
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @returns A guard
 */
function not(guard) {
  function not(args, params) {
    return false;
  }
  not.check = checkNot;
  not.guards = [guard];
  return not;
}
function checkAnd(snapshot, {
  context,
  event
}, {
  guards
}) {
  return guards.every(guard => evaluateGuard(guard, context, event, snapshot));
}

/**
 * Higher-order guard that evaluates to `true` if all `guards` passed to it
 * evaluate to `true`.
 *
 * @category Guards
 * @example
 *
 * ```ts
 * import { setup, and } from 'xstate';
 *
 * const machine = setup({
 *   guards: {
 *     someNamedGuard: () => true
 *   }
 * }).createMachine({
 *   on: {
 *     someEvent: {
 *       guard: and([({ context }) => context.value > 0, 'someNamedGuard']),
 *       actions: () => {
 *         // will be executed if all guards in `and(...)`
 *         // evaluate to true
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @returns A guard action object
 */
function and(guards) {
  function and(args, params) {
    return false;
  }
  and.check = checkAnd;
  and.guards = guards;
  return and;
}
function checkOr(snapshot, {
  context,
  event
}, {
  guards
}) {
  return guards.some(guard => evaluateGuard(guard, context, event, snapshot));
}

/**
 * Higher-order guard that evaluates to `true` if any of the `guards` passed to
 * it evaluate to `true`.
 *
 * @category Guards
 * @example
 *
 * ```ts
 * import { setup, or } from 'xstate';
 *
 * const machine = setup({
 *   guards: {
 *     someNamedGuard: () => true
 *   }
 * }).createMachine({
 *   on: {
 *     someEvent: {
 *       guard: or([({ context }) => context.value > 0, 'someNamedGuard']),
 *       actions: () => {
 *         // will be executed if any of the guards in `or(...)`
 *         // evaluate to true
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @returns A guard action object
 */
function or(guards) {
  function or(args, params) {
    return false;
  }
  or.check = checkOr;
  or.guards = guards;
  return or;
}

// TODO: throw on cycles (depth check should be enough)
function evaluateGuard(guard, context, event, snapshot) {
  const {
    machine
  } = snapshot;
  const isInline = typeof guard === 'function';
  const resolved = isInline ? guard : machine.implementations.guards[typeof guard === 'string' ? guard : guard.type];
  if (!isInline && !resolved) {
    throw new Error(`Guard '${typeof guard === 'string' ? guard : guard.type}' is not implemented.'.`);
  }
  if (typeof resolved !== 'function') {
    return evaluateGuard(resolved, context, event, snapshot);
  }
  const guardArgs = {
    context,
    event
  };
  const guardParams = isInline || typeof guard === 'string' ? undefined : 'params' in guard ? typeof guard.params === 'function' ? guard.params({
    context,
    event
  }) : guard.params : undefined;
  if (!('check' in resolved)) {
    // the existing type of `.guards` assumes non-nullable `TExpressionGuard`
    // inline guards expect `TExpressionGuard` to be set to `undefined`
    // it's fine to cast this here, our logic makes sure that we call those 2 "variants" correctly
    return resolved(guardArgs, guardParams);
  }
  const builtinGuard = resolved;
  return builtinGuard.check(snapshot, guardArgs, resolved // this holds all params
  );
}

function resolveRaise(_, snapshot, args, actionParams, {
  event: eventOrExpr,
  id,
  delay
}, {
  internalQueue
}) {
  const delaysMap = snapshot.machine.implementations.delays;
  if (typeof eventOrExpr === 'string') {
    throw new Error(`Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`);
  }
  const resolvedEvent = typeof eventOrExpr === 'function' ? eventOrExpr(args, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay === 'string') {
    const configDelay = delaysMap && delaysMap[delay];
    resolvedDelay = typeof configDelay === 'function' ? configDelay(args, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay === 'function' ? delay(args, actionParams) : delay;
  }
  if (typeof resolvedDelay !== 'number') {
    internalQueue.push(resolvedEvent);
  }
  return [snapshot, {
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }];
}
function executeRaise(actorScope, params) {
  const {
    event,
    delay,
    id
  } = params;
  if (typeof delay === 'number') {
    actorScope.defer(() => {
      const self = actorScope.self;
      actorScope.system.scheduler.schedule(self, self, event, delay, id);
    });
    return;
  }
}
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */
function raise(eventOrExpr, options) {
  function raise(args, params) {
  }
  raise.type = 'xstate.raise';
  raise.event = eventOrExpr;
  raise.id = options?.id;
  raise.delay = options?.delay;
  raise.resolve = resolveRaise;
  raise.execute = executeRaise;
  return raise;
}

function resolveSpawn(actorScope, snapshot, actionArgs, _actionParams, {
  id,
  systemId,
  src,
  input,
  syncSnapshot
}) {
  const logic = typeof src === 'string' ? resolveReferencedActor(snapshot.machine, src) : src;
  const resolvedId = typeof id === 'function' ? id(actionArgs) : id;
  let actorRef;
  if (logic) {
    actorRef = createActor(logic, {
      id: resolvedId,
      src,
      parent: actorScope.self,
      syncSnapshot,
      systemId,
      input: typeof input === 'function' ? input({
        context: snapshot.context,
        event: actionArgs.event,
        self: actorScope.self
      }) : input
    });
  }
  return [cloneMachineSnapshot(snapshot, {
    children: {
      ...snapshot.children,
      [resolvedId]: actorRef
    }
  }), {
    id,
    actorRef
  }];
}
function executeSpawn(actorScope, {
  id,
  actorRef
}) {
  if (!actorRef) {
    return;
  }
  actorScope.defer(() => {
    if (actorRef._processingStatus === ProcessingStatus.Stopped) {
      return;
    }
    actorRef.start();
  });
}
function spawnChild(...[src, {
  id,
  systemId,
  input,
  syncSnapshot = false
} = {}]) {
  function spawnChild(args, params) {
  }
  spawnChild.type = 'snapshot.spawnChild';
  spawnChild.id = id;
  spawnChild.systemId = systemId;
  spawnChild.src = src;
  spawnChild.input = input;
  spawnChild.syncSnapshot = syncSnapshot;
  spawnChild.resolve = resolveSpawn;
  spawnChild.execute = executeSpawn;
  return spawnChild;
}

function resolveStop(_, snapshot, args, actionParams, {
  actorRef
}) {
  const actorRefOrString = typeof actorRef === 'function' ? actorRef(args, actionParams) : actorRef;
  const resolvedActorRef = typeof actorRefOrString === 'string' ? snapshot.children[actorRefOrString] : actorRefOrString;
  let children = snapshot.children;
  if (resolvedActorRef) {
    children = {
      ...children
    };
    delete children[resolvedActorRef.id];
  }
  return [cloneMachineSnapshot(snapshot, {
    children
  }), resolvedActorRef];
}
function executeStop(actorScope, actorRef) {
  if (!actorRef) {
    return;
  }

  // we need to eagerly unregister it here so a new actor with the same systemId can be registered immediately
  // since we defer actual stopping of the actor but we don't defer actor creations (and we can't do that)
  // this could throw on `systemId` collision, for example, when dealing with reentering transitions
  actorScope.system._unregister(actorRef);

  // this allows us to prevent an actor from being started if it gets stopped within the same macrostep
  // this can happen, for example, when the invoking state is being exited immediately by an always transition
  if (actorRef._processingStatus !== ProcessingStatus.Running) {
    actorScope.stopChild(actorRef);
    return;
  }
  // stopping a child enqueues a stop event in the child actor's mailbox
  // we need for all of the already enqueued events to be processed before we stop the child
  // the parent itself might want to send some events to a child (for example from exit actions on the invoking state)
  // and we don't want to ignore those events
  actorScope.defer(() => {
    actorScope.stopChild(actorRef);
  });
}
/**
 * Stops a child actor.
 *
 * @param actorRef The actor to stop.
 */
function stopChild(actorRef) {
  function stop(args, params) {
  }
  stop.type = 'xstate.stopChild';
  stop.actorRef = actorRef;
  stop.resolve = resolveStop;
  stop.execute = executeStop;
  return stop;
}

/**
 * Stops a child actor.
 *
 * @deprecated Use `stopChild(...)` instead
 * @alias
 */
const stop = (/* unused pure expression or super */ null && (stopChild));

const isAtomicStateNode = stateNode => stateNode.type === 'atomic' || stateNode.type === 'final';
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter(sn => sn.type !== 'history');
}
function getProperAncestors(stateNode, toStateNode) {
  const ancestors = [];
  if (toStateNode === stateNode) {
    return ancestors;
  }

  // add all ancestors
  let m = stateNode.parent;
  while (m && m !== toStateNode) {
    ancestors.push(m);
    m = m.parent;
  }
  return ancestors;
}
function getAllStateNodes(stateNodes) {
  const nodeSet = new Set(stateNodes);
  const adjList = getAdjList(nodeSet);

  // add descendants
  for (const s of nodeSet) {
    // if previously active, add existing child nodes
    if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
      getInitialStateNodesWithTheirAncestors(s).forEach(sn => nodeSet.add(sn));
    } else {
      if (s.type === 'parallel') {
        for (const child of getChildren(s)) {
          if (child.type === 'history') {
            continue;
          }
          if (!nodeSet.has(child)) {
            const initialStates = getInitialStateNodesWithTheirAncestors(child);
            for (const initialStateNode of initialStates) {
              nodeSet.add(initialStateNode);
            }
          }
        }
      }
    }
  }

  // add all ancestors
  for (const s of nodeSet) {
    let m = s.parent;
    while (m) {
      nodeSet.add(m);
      m = m.parent;
    }
  }
  return nodeSet;
}
function getValueFromAdj(baseNode, adjList) {
  const childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    const childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isAtomicStateNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  const stateValue = {};
  for (const childStateNode of childStateNodes) {
    stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
  }
  return stateValue;
}
function getAdjList(stateNodes) {
  const adjList = new Map();
  for (const s of stateNodes) {
    if (!adjList.has(s)) {
      adjList.set(s, []);
    }
    if (s.parent) {
      if (!adjList.has(s.parent)) {
        adjList.set(s.parent, []);
      }
      adjList.get(s.parent).push(s);
    }
  }
  return adjList;
}
function getStateValue(rootNode, stateNodes) {
  const config = getAllStateNodes(stateNodes);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function isInFinalState(stateNodeSet, stateNode) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(s => s.type === 'final' && stateNodeSet.has(s));
  }
  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(sn => isInFinalState(stateNodeSet, sn));
  }
  return stateNode.type === 'final';
}
const isStateId = str => str[0] === STATE_IDENTIFIER;
function getCandidates(stateNode, receivedEventType) {
  const candidates = stateNode.transitions.get(receivedEventType) || [...stateNode.transitions.keys()].filter(eventDescriptor => {
    // check if transition is a wildcard transition,
    // which matches any non-transient events
    if (eventDescriptor === WILDCARD) {
      return true;
    }
    if (!eventDescriptor.endsWith('.*')) {
      return false;
    }
    const partialEventTokens = eventDescriptor.split('.');
    const eventTokens = receivedEventType.split('.');
    for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
      const partialEventToken = partialEventTokens[tokenIndex];
      const eventToken = eventTokens[tokenIndex];
      if (partialEventToken === '*') {
        const isLastToken = tokenIndex === partialEventTokens.length - 1;
        return isLastToken;
      }
      if (partialEventToken !== eventToken) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => b.length - a.length).flatMap(key => stateNode.transitions.get(key));
  return candidates;
}

/** All delayed transitions from the config. */
function getDelayedTransitions(stateNode) {
  const afterConfig = stateNode.config.after;
  if (!afterConfig) {
    return [];
  }
  const mutateEntryExit = (delay, i) => {
    const afterEvent = createAfterEvent(delay, stateNode.id);
    const eventType = afterEvent.type;
    stateNode.entry.push(raise(afterEvent, {
      id: eventType,
      delay
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  const delayedTransitions = Object.keys(afterConfig).flatMap((delay, i) => {
    const configTransition = afterConfig[delay];
    const resolvedTransition = typeof configTransition === 'string' ? {
      target: configTransition
    } : configTransition;
    const resolvedDelay = Number.isNaN(+delay) ? delay : +delay;
    const eventType = mutateEntryExit(resolvedDelay);
    return toArray(resolvedTransition).map(transition => ({
      ...transition,
      event: eventType,
      delay: resolvedDelay
    }));
  });
  return delayedTransitions.map(delayedTransition => {
    const {
      delay
    } = delayedTransition;
    return {
      ...formatTransition(stateNode, delayedTransition.event, delayedTransition),
      delay
    };
  });
}
function formatTransition(stateNode, descriptor, transitionConfig) {
  const normalizedTarget = normalizeTarget(transitionConfig.target);
  const reenter = transitionConfig.reenter ?? false;
  const target = resolveTarget(stateNode, normalizedTarget);
  const transition = {
    ...transitionConfig,
    actions: toArray(transitionConfig.actions),
    guard: transitionConfig.guard,
    target,
    source: stateNode,
    reenter,
    eventType: descriptor,
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: target ? target.map(t => `#${t.id}`) : undefined
    })
  };
  return transition;
}
function formatTransitions(stateNode) {
  const transitions = new Map();
  if (stateNode.config.on) {
    for (const descriptor of Object.keys(stateNode.config.on)) {
      if (descriptor === NULL_EVENT) {
        throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
      }
      const transitionsConfig = stateNode.config.on[descriptor];
      transitions.set(descriptor, toTransitionConfigArray(transitionsConfig).map(t => formatTransition(stateNode, descriptor, t)));
    }
  }
  if (stateNode.config.onDone) {
    const descriptor = `xstate.done.state.${stateNode.id}`;
    transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map(t => formatTransition(stateNode, descriptor, t)));
  }
  for (const invokeDef of stateNode.invoke) {
    if (invokeDef.onDone) {
      const descriptor = `xstate.done.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map(t => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onError) {
      const descriptor = `xstate.error.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onError).map(t => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onSnapshot) {
      const descriptor = `xstate.snapshot.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onSnapshot).map(t => formatTransition(stateNode, descriptor, t)));
    }
  }
  for (const delayedTransition of stateNode.after) {
    let existing = transitions.get(delayedTransition.eventType);
    if (!existing) {
      existing = [];
      transitions.set(delayedTransition.eventType, existing);
    }
    existing.push(delayedTransition);
  }
  return transitions;
}
function formatInitialTransition(stateNode, _target) {
  const resolvedTarget = typeof _target === 'string' ? stateNode.states[_target] : _target ? stateNode.states[_target.target] : undefined;
  if (!resolvedTarget && _target) {
    throw new Error(`Initial state node "${_target}" not found on parent state node #${stateNode.id}`);
  }
  const transition = {
    source: stateNode,
    actions: !_target || typeof _target === 'string' ? [] : toArray(_target.actions),
    eventType: null,
    reenter: false,
    target: resolvedTarget ? [resolvedTarget] : [],
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: resolvedTarget ? [`#${resolvedTarget.id}`] : []
    })
  };
  return transition;
}
function resolveTarget(stateNode, targets) {
  if (targets === undefined) {
    // an undefined target signals that the state node should not transition from that state when receiving that event
    return undefined;
  }
  return targets.map(target => {
    if (typeof target !== 'string') {
      return target;
    }
    if (isStateId(target)) {
      return stateNode.machine.getStateNodeById(target);
    }
    const isInternalTarget = target[0] === STATE_DELIMITER;
    // If internal target is defined on machine,
    // do not include machine key on target
    if (isInternalTarget && !stateNode.parent) {
      return getStateNodeByPath(stateNode, target.slice(1));
    }
    const resolvedTarget = isInternalTarget ? stateNode.key + target : target;
    if (stateNode.parent) {
      try {
        const targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
        return targetStateNode;
      } catch (err) {
        throw new Error(`Invalid transition definition for state node '${stateNode.id}':\n${err.message}`);
      }
    } else {
      throw new Error(`Invalid target: "${target}" is not a valid target from the root node. Did you mean ".${target}"?`);
    }
  });
}
function resolveHistoryDefaultTransition(stateNode) {
  const normalizedTarget = normalizeTarget(stateNode.config.target);
  if (!normalizedTarget) {
    return stateNode.parent.initial;
  }
  return {
    target: normalizedTarget.map(t => typeof t === 'string' ? getStateNodeByPath(stateNode.parent, t) : t)
  };
}
function isHistoryNode(stateNode) {
  return stateNode.type === 'history';
}
function getInitialStateNodesWithTheirAncestors(stateNode) {
  const states = getInitialStateNodes(stateNode);
  for (const initialState of states) {
    for (const ancestor of getProperAncestors(initialState, stateNode)) {
      states.add(ancestor);
    }
  }
  return states;
}
function getInitialStateNodes(stateNode) {
  const set = new Set();
  function iter(descStateNode) {
    if (set.has(descStateNode)) {
      return;
    }
    set.add(descStateNode);
    if (descStateNode.type === 'compound') {
      iter(descStateNode.initial.target[0]);
    } else if (descStateNode.type === 'parallel') {
      for (const child of getChildren(descStateNode)) {
        iter(child);
      }
    }
  }
  iter(stateNode);
  return set;
}
/** Returns the child state node from its relative `stateKey`, or throws. */
function getStateNode(stateNode, stateKey) {
  if (isStateId(stateKey)) {
    return stateNode.machine.getStateNodeById(stateKey);
  }
  if (!stateNode.states) {
    throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
  }
  const result = stateNode.states[stateKey];
  if (!result) {
    throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
  }
  return result;
}

/**
 * Returns the relative state node from the given `statePath`, or throws.
 *
 * @param statePath The string or string array relative path to the state node.
 */
function getStateNodeByPath(stateNode, statePath) {
  if (typeof statePath === 'string' && isStateId(statePath)) {
    try {
      return stateNode.machine.getStateNodeById(statePath);
    } catch (e) {
      // try individual paths
      // throw e;
    }
  }
  const arrayStatePath = toStatePath(statePath).slice();
  let currentStateNode = stateNode;
  while (arrayStatePath.length) {
    const key = arrayStatePath.shift();
    if (!key.length) {
      break;
    }
    currentStateNode = getStateNode(currentStateNode, key);
  }
  return currentStateNode;
}

/**
 * Returns the state nodes represented by the current state value.
 *
 * @param stateValue The state value or State instance
 */
function getStateNodes(stateNode, stateValue) {
  if (typeof stateValue === 'string') {
    const childStateNode = stateNode.states[stateValue];
    if (!childStateNode) {
      throw new Error(`State '${stateValue}' does not exist on '${stateNode.id}'`);
    }
    return [stateNode, childStateNode];
  }
  const childStateKeys = Object.keys(stateValue);
  const childStateNodes = childStateKeys.map(subStateKey => getStateNode(stateNode, subStateKey)).filter(Boolean);
  return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
    const subStateNode = getStateNode(stateNode, subStateKey);
    if (!subStateNode) {
      return allSubStateNodes;
    }
    const subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
    return allSubStateNodes.concat(subStateNodes);
  }, []));
}
function transitionAtomicNode(stateNode, stateValue, snapshot, event) {
  const childStateNode = getStateNode(stateNode, stateValue);
  const next = childStateNode.next(snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionCompoundNode(stateNode, stateValue, snapshot, event) {
  const subStateKeys = Object.keys(stateValue);
  const childStateNode = getStateNode(stateNode, subStateKeys[0]);
  const next = transitionNode(childStateNode, stateValue[subStateKeys[0]], snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionParallelNode(stateNode, stateValue, snapshot, event) {
  const allInnerTransitions = [];
  for (const subStateKey of Object.keys(stateValue)) {
    const subStateValue = stateValue[subStateKey];
    if (!subStateValue) {
      continue;
    }
    const subStateNode = getStateNode(stateNode, subStateKey);
    const innerTransitions = transitionNode(subStateNode, subStateValue, snapshot, event);
    if (innerTransitions) {
      allInnerTransitions.push(...innerTransitions);
    }
  }
  if (!allInnerTransitions.length) {
    return stateNode.next(snapshot, event);
  }
  return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, snapshot, event) {
  // leaf node
  if (typeof stateValue === 'string') {
    return transitionAtomicNode(stateNode, stateValue, snapshot, event);
  }

  // compound node
  if (Object.keys(stateValue).length === 1) {
    return transitionCompoundNode(stateNode, stateValue, snapshot, event);
  }

  // parallel node
  return transitionParallelNode(stateNode, stateValue, snapshot, event);
}
function getHistoryNodes(stateNode) {
  return Object.keys(stateNode.states).map(key => stateNode.states[key]).filter(sn => sn.type === 'history');
}
function isDescendant(childStateNode, parentStateNode) {
  let marker = childStateNode;
  while (marker.parent && marker.parent !== parentStateNode) {
    marker = marker.parent;
  }
  return marker.parent === parentStateNode;
}
function hasIntersection(s1, s2) {
  const set1 = new Set(s1);
  const set2 = new Set(s2);
  for (const item of set1) {
    if (set2.has(item)) {
      return true;
    }
  }
  for (const item of set2) {
    if (set1.has(item)) {
      return true;
    }
  }
  return false;
}
function removeConflictingTransitions(enabledTransitions, stateNodeSet, historyValue) {
  const filteredTransitions = new Set();
  for (const t1 of enabledTransitions) {
    let t1Preempted = false;
    const transitionsToRemove = new Set();
    for (const t2 of filteredTransitions) {
      if (hasIntersection(computeExitSet([t1], stateNodeSet, historyValue), computeExitSet([t2], stateNodeSet, historyValue))) {
        if (isDescendant(t1.source, t2.source)) {
          transitionsToRemove.add(t2);
        } else {
          t1Preempted = true;
          break;
        }
      }
    }
    if (!t1Preempted) {
      for (const t3 of transitionsToRemove) {
        filteredTransitions.delete(t3);
      }
      filteredTransitions.add(t1);
    }
  }
  return Array.from(filteredTransitions);
}
function findLeastCommonAncestor(stateNodes) {
  const [head, ...tail] = stateNodes;
  for (const ancestor of getProperAncestors(head, undefined)) {
    if (tail.every(sn => isDescendant(sn, ancestor))) {
      return ancestor;
    }
  }
}
function getEffectiveTargetStates(transition, historyValue) {
  if (!transition.target) {
    return [];
  }
  const targets = new Set();
  for (const targetNode of transition.target) {
    if (isHistoryNode(targetNode)) {
      if (historyValue[targetNode.id]) {
        for (const node of historyValue[targetNode.id]) {
          targets.add(node);
        }
      } else {
        for (const node of getEffectiveTargetStates(resolveHistoryDefaultTransition(targetNode), historyValue)) {
          targets.add(node);
        }
      }
    } else {
      targets.add(targetNode);
    }
  }
  return [...targets];
}
function getTransitionDomain(transition, historyValue) {
  const targetStates = getEffectiveTargetStates(transition, historyValue);
  if (!targetStates) {
    return;
  }
  if (!transition.reenter && targetStates.every(target => target === transition.source || isDescendant(target, transition.source))) {
    return transition.source;
  }
  const lca = findLeastCommonAncestor(targetStates.concat(transition.source));
  if (lca) {
    return lca;
  }

  // at this point we know that it's a root transition since LCA couldn't be found
  if (transition.reenter) {
    return;
  }
  return transition.source.machine.root;
}
function computeExitSet(transitions, stateNodeSet, historyValue) {
  const statesToExit = new Set();
  for (const t of transitions) {
    if (t.target?.length) {
      const domain = getTransitionDomain(t, historyValue);
      if (t.reenter && t.source === domain) {
        statesToExit.add(domain);
      }
      for (const stateNode of stateNodeSet) {
        if (isDescendant(stateNode, domain)) {
          statesToExit.add(stateNode);
        }
      }
    }
  }
  return [...statesToExit];
}
function areStateNodeCollectionsEqual(prevStateNodes, nextStateNodeSet) {
  if (prevStateNodes.length !== nextStateNodeSet.size) {
    return false;
  }
  for (const node of prevStateNodes) {
    if (!nextStateNodeSet.has(node)) {
      return false;
    }
  }
  return true;
}

/** https://www.w3.org/TR/scxml/#microstepProcedure */
function microstep(transitions, currentSnapshot, actorScope, event, isInitial, internalQueue) {
  if (!transitions.length) {
    return currentSnapshot;
  }
  const mutStateNodeSet = new Set(currentSnapshot._nodes);
  let historyValue = currentSnapshot.historyValue;
  const filteredTransitions = removeConflictingTransitions(transitions, mutStateNodeSet, historyValue);
  let nextState = currentSnapshot;

  // Exit states
  if (!isInitial) {
    [nextState, historyValue] = exitStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, historyValue, internalQueue);
  }

  // Execute transition content
  nextState = resolveActionsAndContext(nextState, event, actorScope, filteredTransitions.flatMap(t => t.actions), internalQueue);

  // Enter states
  nextState = enterStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial);
  const nextStateNodes = [...mutStateNodeSet];
  if (nextState.status === 'done') {
    nextState = resolveActionsAndContext(nextState, event, actorScope, nextStateNodes.sort((a, b) => b.order - a.order).flatMap(state => state.exit), internalQueue);
  }
  try {
    if (historyValue === currentSnapshot.historyValue && areStateNodeCollectionsEqual(currentSnapshot._nodes, mutStateNodeSet)) {
      return nextState;
    }
    return cloneMachineSnapshot(nextState, {
      _nodes: nextStateNodes,
      historyValue
    });
  } catch (e) {
    // TODO: Refactor this once proper error handling is implemented.
    // See https://github.com/statelyai/rfcs/pull/4
    throw e;
  }
}
function getMachineOutput(snapshot, event, actorScope, rootNode, rootCompletionNode) {
  if (rootNode.output === undefined) {
    return;
  }
  const doneStateEvent = createDoneStateEvent(rootCompletionNode.id, rootCompletionNode.output !== undefined && rootCompletionNode.parent ? resolveOutput(rootCompletionNode.output, snapshot.context, event, actorScope.self) : undefined);
  return resolveOutput(rootNode.output, snapshot.context, doneStateEvent, actorScope.self);
}
function enterStates(currentSnapshot, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial) {
  let nextSnapshot = currentSnapshot;
  const statesToEnter = new Set();
  // those are states that were directly targeted or indirectly targeted by the explicit target
  // in other words, those are states for which initial actions should be executed
  // when we target `#deep_child` initial actions of its ancestors shouldn't be executed
  const statesForDefaultEntry = new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);

  // In the initial state, the root state node is "entered".
  if (isInitial) {
    statesForDefaultEntry.add(currentSnapshot.machine.root);
  }
  const completedNodes = new Set();
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    mutStateNodeSet.add(stateNodeToEnter);
    const actions = [];

    // Add entry actions
    actions.push(...stateNodeToEnter.entry);
    for (const invokeDef of stateNodeToEnter.invoke) {
      actions.push(spawnChild(invokeDef.src, {
        ...invokeDef,
        syncSnapshot: !!invokeDef.onSnapshot
      }));
    }
    if (statesForDefaultEntry.has(stateNodeToEnter)) {
      const initialActions = stateNodeToEnter.initial.actions;
      actions.push(...initialActions);
    }
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, actions, internalQueue, stateNodeToEnter.invoke.map(invokeDef => invokeDef.id));
    if (stateNodeToEnter.type === 'final') {
      const parent = stateNodeToEnter.parent;
      let ancestorMarker = parent?.type === 'parallel' ? parent : parent?.parent;
      let rootCompletionNode = ancestorMarker || stateNodeToEnter;
      if (parent?.type === 'compound') {
        internalQueue.push(createDoneStateEvent(parent.id, stateNodeToEnter.output !== undefined ? resolveOutput(stateNodeToEnter.output, nextSnapshot.context, event, actorScope.self) : undefined));
      }
      while (ancestorMarker?.type === 'parallel' && !completedNodes.has(ancestorMarker) && isInFinalState(mutStateNodeSet, ancestorMarker)) {
        completedNodes.add(ancestorMarker);
        internalQueue.push(createDoneStateEvent(ancestorMarker.id));
        rootCompletionNode = ancestorMarker;
        ancestorMarker = ancestorMarker.parent;
      }
      if (ancestorMarker) {
        continue;
      }
      nextSnapshot = cloneMachineSnapshot(nextSnapshot, {
        status: 'done',
        output: getMachineOutput(nextSnapshot, event, actorScope, nextSnapshot.machine.root, rootCompletionNode)
      });
    }
  }
  return nextSnapshot;
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  for (const t of transitions) {
    const domain = getTransitionDomain(t, historyValue);
    for (const s of t.target || []) {
      if (!isHistoryNode(s) && (
      // if the target is different than the source then it will *definitely* be entered
      t.source !== s ||
      // we know that the domain can't lie within the source
      // if it's different than the source then it's outside of it and it means that the target has to be entered as well
      t.source !== domain ||
      // reentering transitions always enter the target, even if it's the source itself
      t.reenter)) {
        statesToEnter.add(s);
        statesForDefaultEntry.add(s);
      }
      addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
    }
    const targetStates = getEffectiveTargetStates(t, historyValue);
    for (const s of targetStates) {
      const ancestors = getProperAncestors(s, domain);
      if (domain?.type === 'parallel') {
        ancestors.push(domain);
      }
      addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, !t.source.parent && t.reenter ? undefined : domain);
    }
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      const historyStateNodes = historyValue[stateNode.id];
      for (const s of historyStateNodes) {
        statesToEnter.add(s);
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyStateNodes) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    } else {
      const historyDefaultTransition = resolveHistoryDefaultTransition(stateNode);
      for (const s of historyDefaultTransition.target) {
        statesToEnter.add(s);
        if (historyDefaultTransition === stateNode.parent?.initial) {
          statesForDefaultEntry.add(stateNode.parent);
        }
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyDefaultTransition.target) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    }
  } else {
    if (stateNode.type === 'compound') {
      const [initialState] = stateNode.initial.target;
      if (!isHistoryNode(initialState)) {
        statesToEnter.add(initialState);
        statesForDefaultEntry.add(initialState);
      }
      addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
      addProperAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
    } else {
      if (stateNode.type === 'parallel') {
        for (const child of getChildren(stateNode).filter(sn => !isHistoryNode(sn))) {
          if (![...statesToEnter].some(s => isDescendant(s, child))) {
            if (!isHistoryNode(child)) {
              statesToEnter.add(child);
              statesForDefaultEntry.add(child);
            }
            addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
          }
        }
      }
    }
  }
}
function addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, reentrancyDomain) {
  for (const anc of ancestors) {
    if (!reentrancyDomain || isDescendant(anc, reentrancyDomain)) {
      statesToEnter.add(anc);
    }
    if (anc.type === 'parallel') {
      for (const child of getChildren(anc).filter(sn => !isHistoryNode(sn))) {
        if (![...statesToEnter].some(s => isDescendant(s, child))) {
          statesToEnter.add(child);
          addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
        }
      }
    }
  }
}
function addProperAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, getProperAncestors(stateNode, toStateNode));
}
function exitStates(currentSnapshot, event, actorScope, transitions, mutStateNodeSet, historyValue, internalQueue) {
  let nextSnapshot = currentSnapshot;
  const statesToExit = computeExitSet(transitions, mutStateNodeSet, historyValue);
  statesToExit.sort((a, b) => b.order - a.order);
  let changedHistory;

  // From SCXML algorithm: https://www.w3.org/TR/scxml/#exitStates
  for (const exitStateNode of statesToExit) {
    for (const historyNode of getHistoryNodes(exitStateNode)) {
      let predicate;
      if (historyNode.history === 'deep') {
        predicate = sn => isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
      } else {
        predicate = sn => {
          return sn.parent === exitStateNode;
        };
      }
      changedHistory ??= {
        ...historyValue
      };
      changedHistory[historyNode.id] = Array.from(mutStateNodeSet).filter(predicate);
    }
  }
  for (const s of statesToExit) {
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, [...s.exit, ...s.invoke.map(def => stopChild(def.id))], internalQueue);
    mutStateNodeSet.delete(s);
  }
  return [nextSnapshot, changedHistory || historyValue];
}
let executingCustomAction = false;
function resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, extra, retries) {
  const {
    machine
  } = currentSnapshot;
  let intermediateSnapshot = currentSnapshot;
  for (const action of actions) {
    const isInline = typeof action === 'function';
    const resolvedAction = isInline ? action :
    // the existing type of `.actions` assumes non-nullable `TExpressionAction`
    // it's fine to cast this here to get a common type and lack of errors in the rest of the code
    // our logic below makes sure that we call those 2 "variants" correctly
    machine.implementations.actions[typeof action === 'string' ? action : action.type];
    if (!resolvedAction) {
      continue;
    }
    const actionArgs = {
      context: intermediateSnapshot.context,
      event,
      self: actorScope.self,
      system: actorScope.system
    };
    const actionParams = isInline || typeof action === 'string' ? undefined : 'params' in action ? typeof action.params === 'function' ? action.params({
      context: intermediateSnapshot.context,
      event
    }) : action.params : undefined;
    function executeAction() {
      actorScope.system._sendInspectionEvent({
        type: '@xstate.action',
        actorRef: actorScope.self,
        action: {
          type: typeof action === 'string' ? action : typeof action === 'object' ? action.type : action.name || '(anonymous)',
          params: actionParams
        }
      });
      try {
        executingCustomAction = resolvedAction;
        resolvedAction(actionArgs, actionParams);
      } finally {
        executingCustomAction = false;
      }
    }
    if (!('resolve' in resolvedAction)) {
      if (actorScope.self._processingStatus === ProcessingStatus.Running) {
        executeAction();
      } else {
        actorScope.defer(() => {
          executeAction();
        });
      }
      continue;
    }
    const builtinAction = resolvedAction;
    const [nextState, params, actions] = builtinAction.resolve(actorScope, intermediateSnapshot, actionArgs, actionParams, resolvedAction,
    // this holds all params
    extra);
    intermediateSnapshot = nextState;
    if ('retryResolve' in builtinAction) {
      retries?.push([builtinAction, params]);
    }
    if ('execute' in builtinAction) {
      if (actorScope.self._processingStatus === ProcessingStatus.Running) {
        builtinAction.execute(actorScope, params);
      } else {
        actorScope.defer(builtinAction.execute.bind(null, actorScope, params));
      }
    }
    if (actions) {
      intermediateSnapshot = resolveAndExecuteActionsWithContext(intermediateSnapshot, event, actorScope, actions, extra, retries);
    }
  }
  return intermediateSnapshot;
}
function resolveActionsAndContext(currentSnapshot, event, actorScope, actions, internalQueue, deferredActorIds) {
  const retries = deferredActorIds ? [] : undefined;
  const nextState = resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, {
    internalQueue,
    deferredActorIds
  }, retries);
  retries?.forEach(([builtinAction, params]) => {
    builtinAction.retryResolve(actorScope, nextState, params);
  });
  return nextState;
}
function macrostep(snapshot, event, actorScope, internalQueue = []) {
  let nextSnapshot = snapshot;
  const microstates = [];
  function addMicrostate(microstate, event, transitions) {
    actorScope.system._sendInspectionEvent({
      type: '@xstate.microstep',
      actorRef: actorScope.self,
      event,
      snapshot: microstate,
      _transitions: transitions
    });
    microstates.push(microstate);
  }

  // Handle stop event
  if (event.type === XSTATE_STOP) {
    nextSnapshot = cloneMachineSnapshot(stopChildren(nextSnapshot, event, actorScope), {
      status: 'stopped'
    });
    addMicrostate(nextSnapshot, event, []);
    return {
      snapshot: nextSnapshot,
      microstates
    };
  }
  let nextEvent = event;

  // Assume the state is at rest (no raised events)
  // Determine the next state based on the next microstep
  if (nextEvent.type !== XSTATE_INIT) {
    const currentEvent = nextEvent;
    const isErr = isErrorActorEvent(currentEvent);
    const transitions = selectTransitions(currentEvent, nextSnapshot);
    if (isErr && !transitions.length) {
      // TODO: we should likely only allow transitions selected by very explicit descriptors
      // `*` shouldn't be matched, likely `xstate.error.*` shouldnt be either
      // similarly `xstate.error.actor.*` and `xstate.error.actor.todo.*` have to be considered too
      nextSnapshot = cloneMachineSnapshot(snapshot, {
        status: 'error',
        error: currentEvent.error
      });
      addMicrostate(nextSnapshot, currentEvent, []);
      return {
        snapshot: nextSnapshot,
        microstates
      };
    }
    nextSnapshot = microstep(transitions, snapshot, actorScope, nextEvent, false,
    // isInitial
    internalQueue);
    addMicrostate(nextSnapshot, currentEvent, transitions);
  }
  let shouldSelectEventlessTransitions = true;
  while (nextSnapshot.status === 'active') {
    let enabledTransitions = shouldSelectEventlessTransitions ? selectEventlessTransitions(nextSnapshot, nextEvent) : [];

    // eventless transitions should always be selected after selecting *regular* transitions
    // by assigning `undefined` to `previousState` we ensure that `shouldSelectEventlessTransitions` gets always computed to true in such a case
    const previousState = enabledTransitions.length ? nextSnapshot : undefined;
    if (!enabledTransitions.length) {
      if (!internalQueue.length) {
        break;
      }
      nextEvent = internalQueue.shift();
      enabledTransitions = selectTransitions(nextEvent, nextSnapshot);
    }
    nextSnapshot = microstep(enabledTransitions, nextSnapshot, actorScope, nextEvent, false, internalQueue);
    shouldSelectEventlessTransitions = nextSnapshot !== previousState;
    addMicrostate(nextSnapshot, nextEvent, enabledTransitions);
  }
  if (nextSnapshot.status !== 'active') {
    stopChildren(nextSnapshot, nextEvent, actorScope);
  }
  return {
    snapshot: nextSnapshot,
    microstates
  };
}
function stopChildren(nextState, event, actorScope) {
  return resolveActionsAndContext(nextState, event, actorScope, Object.values(nextState.children).map(child => stopChild(child)), []);
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
  const enabledTransitionSet = new Set();
  const atomicStates = nextState._nodes.filter(isAtomicStateNode);
  for (const stateNode of atomicStates) {
    loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, undefined))) {
      if (!s.always) {
        continue;
      }
      for (const transition of s.always) {
        if (transition.guard === undefined || evaluateGuard(transition.guard, nextState.context, event, nextState)) {
          enabledTransitionSet.add(transition);
          break loop;
        }
      }
    }
  }
  return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState._nodes), nextState.historyValue);
}

/**
 * Resolves a partial state value with its full representation in the state
 * node's machine.
 *
 * @param stateValue The partial state value to resolve.
 */
function resolveStateValue(rootNode, stateValue) {
  const allStateNodes = getAllStateNodes(getStateNodes(rootNode, stateValue));
  return getStateValue(rootNode, [...allStateNodes]);
}

function isMachineSnapshot(value) {
  return !!value && typeof value === 'object' && 'machine' in value && 'value' in value;
}
const machineSnapshotMatches = function matches(testValue) {
  return matchesState(testValue, this.value);
};
const machineSnapshotHasTag = function hasTag(tag) {
  return this.tags.has(tag);
};
const machineSnapshotCan = function can(event) {
  const transitionData = this.machine.getTransitionData(this, event);
  return !!transitionData?.length &&
  // Check that at least one transition is not forbidden
  transitionData.some(t => t.target !== undefined || t.actions.length);
};
const machineSnapshotToJSON = function toJSON() {
  const {
    _nodes: nodes,
    tags,
    machine,
    getMeta,
    toJSON,
    can,
    hasTag,
    matches,
    ...jsonValues
  } = this;
  return {
    ...jsonValues,
    tags: Array.from(tags)
  };
};
const machineSnapshotGetMeta = function getMeta() {
  return this._nodes.reduce((acc, stateNode) => {
    if (stateNode.meta !== undefined) {
      acc[stateNode.id] = stateNode.meta;
    }
    return acc;
  }, {});
};
function createMachineSnapshot(config, machine) {
  return {
    status: config.status,
    output: config.output,
    error: config.error,
    machine,
    context: config.context,
    _nodes: config._nodes,
    value: getStateValue(machine.root, config._nodes),
    tags: new Set(config._nodes.flatMap(sn => sn.tags)),
    children: config.children,
    historyValue: config.historyValue || {},
    matches: machineSnapshotMatches,
    hasTag: machineSnapshotHasTag,
    can: machineSnapshotCan,
    getMeta: machineSnapshotGetMeta,
    toJSON: machineSnapshotToJSON
  };
}
function cloneMachineSnapshot(snapshot, config = {}) {
  return createMachineSnapshot({
    ...snapshot,
    ...config
  }, snapshot.machine);
}
function getPersistedSnapshot(snapshot, options) {
  const {
    _nodes: nodes,
    tags,
    machine,
    children,
    context,
    can,
    hasTag,
    matches,
    getMeta,
    toJSON,
    ...jsonValues
  } = snapshot;
  const childrenJson = {};
  for (const id in children) {
    const child = children[id];
    childrenJson[id] = {
      snapshot: child.getPersistedSnapshot(options),
      src: child.src,
      systemId: child._systemId,
      syncSnapshot: child._syncSnapshot
    };
  }
  const persisted = {
    ...jsonValues,
    context: persistContext(context),
    children: childrenJson
  };
  return persisted;
}
function persistContext(contextPart) {
  let copy;
  for (const key in contextPart) {
    const value = contextPart[key];
    if (value && typeof value === 'object') {
      if ('sessionId' in value && 'send' in value && 'ref' in value) {
        copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
          ...contextPart
        };
        copy[key] = {
          xstate$$type: $$ACTOR_TYPE,
          id: value.id
        };
      } else {
        const result = persistContext(value);
        if (result !== value) {
          copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
            ...contextPart
          };
          copy[key] = result;
        }
      }
    }
  }
  return copy ?? contextPart;
}




/***/ }),

/***/ 67200:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ assign)
/* harmony export */ });
/* unused harmony exports S, b, c, e, f, l, s */
/* harmony import */ var _State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41570);


function createSpawner(actorScope, {
  machine,
  context
}, event, spawnedChildren) {
  const spawn = (src, options = {}) => {
    const {
      systemId,
      input
    } = options;
    if (typeof src === 'string') {
      const logic = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__.z)(machine, src);
      if (!logic) {
        throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
      }
      const actorRef = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__.A)(logic, {
        id: options.id,
        parent: actorScope.self,
        syncSnapshot: options.syncSnapshot,
        input: typeof input === 'function' ? input({
          context,
          event,
          self: actorScope.self
        }) : input,
        src,
        systemId
      });
      spawnedChildren[actorRef.id] = actorRef;
      return actorRef;
    } else {
      const actorRef = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__.A)(src, {
        id: options.id,
        parent: actorScope.self,
        syncSnapshot: options.syncSnapshot,
        input: options.input,
        src,
        systemId
      });
      return actorRef;
    }
  };
  return (src, options) => {
    const actorRef = spawn(src, options); // TODO: fix types
    spawnedChildren[actorRef.id] = actorRef;
    actorScope.defer(() => {
      if (actorRef._processingStatus === _State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__.T.Stopped) {
        return;
      }
      actorRef.start();
    });
    return actorRef;
  };
}

function resolveAssign(actorScope, snapshot, actionArgs, actionParams, {
  assignment
}) {
  if (!snapshot.context) {
    throw new Error('Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.');
  }
  const spawnedChildren = {};
  const assignArgs = {
    context: snapshot.context,
    event: actionArgs.event,
    spawn: createSpawner(actorScope, snapshot, actionArgs.event, spawnedChildren),
    self: actorScope.self,
    system: actorScope.system
  };
  let partialUpdate = {};
  if (typeof assignment === 'function') {
    partialUpdate = assignment(assignArgs, actionParams);
  } else {
    for (const key of Object.keys(assignment)) {
      const propAssignment = assignment[key];
      partialUpdate[key] = typeof propAssignment === 'function' ? propAssignment(assignArgs, actionParams) : propAssignment;
    }
  }
  const updatedContext = Object.assign({}, snapshot.context, partialUpdate);
  return [(0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_0__.U)(snapshot, {
    context: updatedContext,
    children: Object.keys(spawnedChildren).length ? {
      ...snapshot.children,
      ...spawnedChildren
    } : snapshot.children
  })];
}
/**
 * Updates the current context of the machine.
 *
 * @example
 *
 * ```ts
 * import { createMachine, assign } from 'xstate';
 *
 * const countMachine = createMachine({
 *   context: {
 *     count: 0,
 *     message: ''
 *   },
 *   on: {
 *     inc: {
 *       actions: assign({
 *         count: ({ context }) => context.count + 1
 *       })
 *     },
 *     updateMessage: {
 *       actions: assign(({ context, event }) => {
 *         return {
 *           message: event.message.trim()
 *         };
 *       })
 *     }
 *   }
 * });
 * ```
 *
 * @param assignment An object that represents the partial context to update, or
 *   a function that returns an object that represents the partial context to
 *   update.
 */
function assign(assignment) {
  function assign(args, params) {
  }
  assign.type = 'xstate.assign';
  assign.assignment = assignment;
  assign.resolve = resolveAssign;
  return assign;
}

function resolveEmit(_, snapshot, args, actionParams, {
  event: eventOrExpr
}) {
  const resolvedEvent = typeof eventOrExpr === 'function' ? eventOrExpr(args, actionParams) : eventOrExpr;
  return [snapshot, {
    event: resolvedEvent
  }];
}
function executeEmit(actorScope, {
  event
}) {
  actorScope.defer(() => actorScope.emit(event));
}
/**
 * Emits an event to event handlers registered on the actor via `actor.on(event,
 * handler)`.
 *
 * @example
 *
 * ```ts
 * import { emit } from 'xstate';
 *
 * const machine = createMachine({
 *   // ...
 *   on: {
 *     something: {
 *       actions: emit({
 *         type: 'emitted',
 *         some: 'data'
 *       })
 *     }
 *   }
 *   // ...
 * });
 *
 * const actor = createActor(machine).start();
 *
 * actor.on('emitted', (event) => {
 *   console.log(event);
 * });
 *
 * actor.send({ type: 'something' });
 * // logs:
 * // {
 * //   type: 'emitted',
 * //   some: 'data'
 * // }
 * ```
 */
function emit( /** The event to emit, or an expression that returns an event to emit. */
eventOrExpr) {
  function emit(args, params) {
  }
  emit.type = 'xstate.emit';
  emit.event = eventOrExpr;
  emit.resolve = resolveEmit;
  emit.execute = executeEmit;
  return emit;
}

/**
 * @remarks
 * `T | unknown` reduces to `unknown` and that can be problematic when it comes
 * to contextual typing. It especially is a problem when the union has a
 * function member, like here:
 *
 * ```ts
 * declare function test(
 *   cbOrVal: ((arg: number) => unknown) | unknown
 * ): void;
 * test((arg) => {}); // oops, implicit any
 * ```
 *
 * This type can be used to avoid this problem. This union represents the same
 * value space as `unknown`.
 */

// https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379091887

// @TODO: Replace with native `NoInfer` when TS issue gets fixed:
// https://github.com/microsoft/TypeScript/pull/57673
/** @deprecated Use the built-in `NoInfer` type instead */
/** The full definition of an event, with a string `type`. */
/**
 * The string or object representing the state value relative to the parent
 * state node.
 *
 * @remarks
 * - For a child atomic state node, this is a string, e.g., `"pending"`.
 * - For complex state nodes, this is an object, e.g., `{ success:
 *   "someChildState" }`.
 */
// TODO: remove once TS fixes this type-widening issue
/** @deprecated Use `AnyMachineSnapshot` instead */
// TODO: possibly refactor this somehow, use even a simpler type, and maybe even make `machine.options` private or something
/** @ignore */
let SpecialTargets = /*#__PURE__*/function (SpecialTargets) {
  SpecialTargets["Parent"] = "#_parent";
  SpecialTargets["Internal"] = "#_internal";
  return SpecialTargets;
}({});

/** @deprecated Use `AnyActor` instead. */

// Based on RxJS types

/** @deprecated Use `Actor<T>` instead. */

/**
 * Represents logic which can be used by an actor.
 *
 * @template TSnapshot - The type of the snapshot.
 * @template TEvent - The type of the event object.
 * @template TInput - The type of the input.
 * @template TSystem - The type of the actor system.
 */

/** @deprecated */

function resolveSendTo(actorScope, snapshot, args, actionParams, {
  to,
  event: eventOrExpr,
  id,
  delay
}, extra) {
  const delaysMap = snapshot.machine.implementations.delays;
  if (typeof eventOrExpr === 'string') {
    throw new Error(`Only event objects may be used with sendTo; use sendTo({ type: "${eventOrExpr}" }) instead`);
  }
  const resolvedEvent = typeof eventOrExpr === 'function' ? eventOrExpr(args, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay === 'string') {
    const configDelay = delaysMap && delaysMap[delay];
    resolvedDelay = typeof configDelay === 'function' ? configDelay(args, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay === 'function' ? delay(args, actionParams) : delay;
  }
  const resolvedTarget = typeof to === 'function' ? to(args, actionParams) : to;
  let targetActorRef;
  if (typeof resolvedTarget === 'string') {
    if (resolvedTarget === SpecialTargets.Parent) {
      targetActorRef = actorScope.self._parent;
    } else if (resolvedTarget === SpecialTargets.Internal) {
      targetActorRef = actorScope.self;
    } else if (resolvedTarget.startsWith('#_')) {
      // SCXML compatibility: https://www.w3.org/TR/scxml/#SCXMLEventProcessor
      // #_invokeid. If the target is the special term '#_invokeid', where invokeid is the invokeid of an SCXML session that the sending session has created by <invoke>, the Processor must add the event to the external queue of that session.
      targetActorRef = snapshot.children[resolvedTarget.slice(2)];
    } else {
      targetActorRef = extra.deferredActorIds?.includes(resolvedTarget) ? resolvedTarget : snapshot.children[resolvedTarget];
    }
    if (!targetActorRef) {
      throw new Error(`Unable to send event to actor '${resolvedTarget}' from machine '${snapshot.machine.id}'.`);
    }
  } else {
    targetActorRef = resolvedTarget || actorScope.self;
  }
  return [snapshot, {
    to: targetActorRef,
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }];
}
function retryResolveSendTo(_, snapshot, params) {
  if (typeof params.to === 'string') {
    params.to = snapshot.children[params.to];
  }
}
function executeSendTo(actorScope, params) {
  // this forms an outgoing events queue
  // thanks to that the recipient actors are able to read the *updated* snapshot value of the sender
  actorScope.defer(() => {
    const {
      to,
      event,
      delay,
      id
    } = params;
    if (typeof delay === 'number') {
      actorScope.system.scheduler.schedule(actorScope.self, to, event, delay, id);
      return;
    }
    actorScope.system._relay(actorScope.self,
    // at this point, in a deferred task, it should already be mutated by retryResolveSendTo
    // if it initially started as a string
    to, event.type === XSTATE_ERROR ? createErrorActorEvent(actorScope.self.id, event.data) : event);
  });
}
/**
 * Sends an event to an actor.
 *
 * @param actor The `ActorRef` to send the event to.
 * @param event The event to send, or an expression that evaluates to the event
 *   to send
 * @param options Send action options
 *
 *   - `id` - The unique send event identifier (used with `cancel()`).
 *   - `delay` - The number of milliseconds to delay the sending of the event.
 */
function sendTo(to, eventOrExpr, options) {
  function sendTo(args, params) {
  }
  sendTo.type = 'xsnapshot.sendTo';
  sendTo.to = to;
  sendTo.event = eventOrExpr;
  sendTo.id = options?.id;
  sendTo.delay = options?.delay;
  sendTo.resolve = resolveSendTo;
  sendTo.retryResolve = retryResolveSendTo;
  sendTo.execute = executeSendTo;
  return sendTo;
}

/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */
function sendParent(event, options) {
  return sendTo(SpecialTargets.Parent, event, options);
}
/**
 * Forwards (sends) an event to the `target` actor.
 *
 * @param target The target actor to forward the event to.
 * @param options Options to pass into the send action creator.
 */
function forwardTo(target, options) {
  return sendTo(target, ({
    event
  }) => event, options);
}

function resolveEnqueueActions(actorScope, snapshot, args, actionParams, {
  collect
}) {
  const actions = [];
  const enqueue = function enqueue(action) {
    actions.push(action);
  };
  enqueue.assign = (...args) => {
    actions.push(assign(...args));
  };
  enqueue.cancel = (...args) => {
    actions.push(cancel(...args));
  };
  enqueue.raise = (...args) => {
    // for some reason it fails to infer `TDelay` from `...args` here and picks its default (`never`)
    // then it fails to typecheck that because `...args` use `string` in place of `TDelay`
    actions.push(raise(...args));
  };
  enqueue.sendTo = (...args) => {
    // for some reason it fails to infer `TDelay` from `...args` here and picks its default (`never`)
    // then it fails to typecheck that because `...args` use `string` in place of `TDelay
    actions.push(sendTo(...args));
  };
  enqueue.sendParent = (...args) => {
    actions.push(sendParent(...args));
  };
  enqueue.spawnChild = (...args) => {
    actions.push(spawnChild(...args));
  };
  enqueue.stopChild = (...args) => {
    actions.push(stopChild(...args));
  };
  enqueue.emit = (...args) => {
    actions.push(emit(...args));
  };
  collect({
    context: args.context,
    event: args.event,
    enqueue,
    check: guard => evaluateGuard(guard, snapshot.context, args.event, snapshot),
    self: actorScope.self,
    system: actorScope.system
  }, actionParams);
  return [snapshot, undefined, actions];
}
/**
 * Creates an action object that will execute actions that are queued by the
 * `enqueue(action)` function.
 *
 * @example
 *
 * ```ts
 * import { createMachine, enqueueActions } from 'xstate';
 *
 * const machine = createMachine({
 *   entry: enqueueActions(({ enqueue, check }) => {
 *     enqueue.assign({ count: 0 });
 *
 *     if (check('someGuard')) {
 *       enqueue.assign({ count: 1 });
 *     }
 *
 *     enqueue('someAction');
 *   })
 * });
 * ```
 */
function enqueueActions(collect) {
  function enqueueActions(args, params) {
  }
  enqueueActions.type = 'xstate.enqueueActions';
  enqueueActions.collect = collect;
  enqueueActions.resolve = resolveEnqueueActions;
  return enqueueActions;
}

function resolveLog(_, snapshot, actionArgs, actionParams, {
  value,
  label
}) {
  return [snapshot, {
    value: typeof value === 'function' ? value(actionArgs, actionParams) : value,
    label
  }];
}
function executeLog({
  logger
}, {
  value,
  label
}) {
  if (label) {
    logger(label, value);
  } else {
    logger(value);
  }
}
/**
 * @param expr The expression function to evaluate which will be logged. Takes
 *   in 2 arguments:
 *
 *   - `ctx` - the current state context
 *   - `event` - the event that caused this action to be executed.
 *
 * @param label The label to give to the logged expression.
 */
function log(value = ({
  context,
  event
}) => ({
  context,
  event
}), label) {
  function log(args, params) {
  }
  log.type = 'xstate.log';
  log.value = value;
  log.label = label;
  log.resolve = resolveLog;
  log.execute = executeLog;
  return log;
}




/***/ }),

/***/ 54709:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mj: () => (/* binding */ setup)
/* harmony export */ });
/* unused harmony exports SimulatedClock, StateMachine, StateNode, assertEvent, createMachine, getInitialSnapshot, getNextSnapshot, toPromise, waitFor */
/* harmony import */ var _State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(41570);
/* harmony import */ var _log_4a38a98a_esm_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67200);
/* harmony import */ var _actors_dist_xstate_actors_esm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8743);







class SimulatedClock {
  constructor() {
    this.timeouts = new Map();
    this._now = 0;
    this._id = 0;
    this._flushing = false;
    this._flushingInvalidated = false;
  }
  now() {
    return this._now;
  }
  getId() {
    return this._id++;
  }
  setTimeout(fn, timeout) {
    this._flushingInvalidated = this._flushing;
    const id = this.getId();
    this.timeouts.set(id, {
      start: this.now(),
      timeout,
      fn
    });
    return id;
  }
  clearTimeout(id) {
    this._flushingInvalidated = this._flushing;
    this.timeouts.delete(id);
  }
  set(time) {
    if (this._now > time) {
      throw new Error('Unable to travel back in time');
    }
    this._now = time;
    this.flushTimeouts();
  }
  flushTimeouts() {
    if (this._flushing) {
      this._flushingInvalidated = true;
      return;
    }
    this._flushing = true;
    const sorted = [...this.timeouts].sort(([_idA, timeoutA], [_idB, timeoutB]) => {
      const endA = timeoutA.start + timeoutA.timeout;
      const endB = timeoutB.start + timeoutB.timeout;
      return endB > endA ? -1 : 1;
    });
    for (const [id, timeout] of sorted) {
      if (this._flushingInvalidated) {
        this._flushingInvalidated = false;
        this._flushing = false;
        this.flushTimeouts();
        return;
      }
      if (this.now() - timeout.start >= timeout.timeout) {
        this.timeouts.delete(id);
        timeout.fn.call(null);
      }
    }
    this._flushing = false;
  }
  increment(ms) {
    this._now += ms;
    this.flushTimeouts();
  }
}

const cache = new WeakMap();
function memo(object, key, fn) {
  let memoizedData = cache.get(object);
  if (!memoizedData) {
    memoizedData = {
      [key]: fn()
    };
    cache.set(object, memoizedData);
  } else if (!(key in memoizedData)) {
    memoizedData[key] = fn();
  }
  return memoizedData[key];
}

const EMPTY_OBJECT = {};
const toSerializableAction = action => {
  if (typeof action === 'string') {
    return {
      type: action
    };
  }
  if (typeof action === 'function') {
    if ('resolve' in action) {
      return {
        type: action.type
      };
    }
    return {
      type: action.name
    };
  }
  return action;
};
class StateNode {
  constructor( /** The raw config used to create the machine. */
  config, options) {
    this.config = config;
    /**
     * The relative key of the state node, which represents its location in the
     * overall state value.
     */
    this.key = void 0;
    /** The unique ID of the state node. */
    this.id = void 0;
    /**
     * The type of this state node:
     *
     * - `'atomic'` - no child state nodes
     * - `'compound'` - nested child state nodes (XOR)
     * - `'parallel'` - orthogonal nested child state nodes (AND)
     * - `'history'` - history state node
     * - `'final'` - final state node
     */
    this.type = void 0;
    /** The string path from the root machine node to this node. */
    this.path = void 0;
    /** The child state nodes. */
    this.states = void 0;
    /**
     * The type of history on this state node. Can be:
     *
     * - `'shallow'` - recalls only top-level historical state value
     * - `'deep'` - recalls historical state value at all levels
     */
    this.history = void 0;
    /** The action(s) to be executed upon entering the state node. */
    this.entry = void 0;
    /** The action(s) to be executed upon exiting the state node. */
    this.exit = void 0;
    /** The parent state node. */
    this.parent = void 0;
    /** The root machine node. */
    this.machine = void 0;
    /**
     * The meta data associated with this state node, which will be returned in
     * State instances.
     */
    this.meta = void 0;
    /**
     * The output data sent with the "xstate.done.state._id_" event if this is a
     * final state node.
     */
    this.output = void 0;
    /**
     * The order this state node appears. Corresponds to the implicit document
     * order.
     */
    this.order = -1;
    this.description = void 0;
    this.tags = [];
    this.transitions = void 0;
    this.always = void 0;
    this.parent = options._parent;
    this.key = options._key;
    this.machine = options._machine;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.id = this.config.id || [this.machine.id, ...this.path].join(_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.S);
    this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.description = this.config.description;
    this.order = this.machine.idMap.size;
    this.machine.idMap.set(this.id, this);
    this.states = this.config.states ? (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.m)(this.config.states, (stateConfig, key) => {
      const stateNode = new StateNode(stateConfig, {
        _parent: this,
        _key: key,
        _machine: this.machine
      });
      return stateNode;
    }) : EMPTY_OBJECT;
    if (this.type === 'compound' && !this.config.initial) {
      throw new Error(`No initial state specified for compound state node "#${this.id}". Try adding { initial: "${Object.keys(this.states)[0]}" } to the state config.`);
    }

    // History config
    this.history = this.config.history === true ? 'shallow' : this.config.history || false;
    this.entry = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.t)(this.config.entry).slice();
    this.exit = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.t)(this.config.exit).slice();
    this.meta = this.config.meta;
    this.output = this.type === 'final' || !this.parent ? this.config.output : undefined;
    this.tags = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.t)(config.tags).slice();
  }

  /** @internal */
  _initialize() {
    this.transitions = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.f)(this);
    if (this.config.always) {
      this.always = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.a)(this.config.always).map(t => (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.b)(this, _State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.N, t));
    }
    Object.keys(this.states).forEach(key => {
      this.states[key]._initialize();
    });
  }

  /** The well-structured state node definition. */
  get definition() {
    return {
      id: this.id,
      key: this.key,
      version: this.machine.version,
      type: this.type,
      initial: this.initial ? {
        target: this.initial.target,
        source: this,
        actions: this.initial.actions.map(toSerializableAction),
        eventType: null,
        reenter: false,
        toJSON: () => ({
          target: this.initial.target.map(t => `#${t.id}`),
          source: `#${this.id}`,
          actions: this.initial.actions.map(toSerializableAction),
          eventType: null
        })
      } : undefined,
      history: this.history,
      states: (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.m)(this.states, state => {
        return state.definition;
      }),
      on: this.on,
      transitions: [...this.transitions.values()].flat().map(t => ({
        ...t,
        actions: t.actions.map(toSerializableAction)
      })),
      entry: this.entry.map(toSerializableAction),
      exit: this.exit.map(toSerializableAction),
      meta: this.meta,
      order: this.order || -1,
      output: this.output,
      invoke: this.invoke,
      description: this.description,
      tags: this.tags
    };
  }

  /** @internal */
  toJSON() {
    return this.definition;
  }

  /** The logic invoked as actors by this state node. */
  get invoke() {
    return memo(this, 'invoke', () => (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.t)(this.config.invoke).map((invokeConfig, i) => {
      const {
        src,
        systemId
      } = invokeConfig;
      const resolvedId = invokeConfig.id ?? (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.c)(this.id, i);
      const resolvedSrc = typeof src === 'string' ? src : `xstate.invoke.${(0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.c)(this.id, i)}`;
      return {
        ...invokeConfig,
        src: resolvedSrc,
        id: resolvedId,
        systemId: systemId,
        toJSON() {
          const {
            onDone,
            onError,
            ...invokeDefValues
          } = invokeConfig;
          return {
            ...invokeDefValues,
            type: 'xstate.invoke',
            src: resolvedSrc,
            id: resolvedId
          };
        }
      };
    }));
  }

  /** The mapping of events to transitions. */
  get on() {
    return memo(this, 'on', () => {
      const transitions = this.transitions;
      return [...transitions].flatMap(([descriptor, t]) => t.map(t => [descriptor, t])).reduce((map, [descriptor, transition]) => {
        map[descriptor] = map[descriptor] || [];
        map[descriptor].push(transition);
        return map;
      }, {});
    });
  }
  get after() {
    return memo(this, 'delayedTransitions', () => (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.g)(this));
  }
  get initial() {
    return memo(this, 'initial', () => (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.d)(this, this.config.initial));
  }

  /** @internal */
  next(snapshot, event) {
    const eventType = event.type;
    const actions = [];
    let selectedTransition;
    const candidates = memo(this, `candidates-${eventType}`, () => (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.h)(this, eventType));
    for (const candidate of candidates) {
      const {
        guard
      } = candidate;
      const resolvedContext = snapshot.context;
      let guardPassed = false;
      try {
        guardPassed = !guard || (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.e)(guard, resolvedContext, event, snapshot);
      } catch (err) {
        const guardType = typeof guard === 'string' ? guard : typeof guard === 'object' ? guard.type : undefined;
        throw new Error(`Unable to evaluate guard ${guardType ? `'${guardType}' ` : ''}in transition for event '${eventType}' in state node '${this.id}':\n${err.message}`);
      }
      if (guardPassed) {
        actions.push(...candidate.actions);
        selectedTransition = candidate;
        break;
      }
    }
    return selectedTransition ? [selectedTransition] : undefined;
  }

  /** All the event types accepted by this state node and its descendants. */
  get events() {
    return memo(this, 'events', () => {
      const {
        states
      } = this;
      const events = new Set(this.ownEvents);
      if (states) {
        for (const stateId of Object.keys(states)) {
          const state = states[stateId];
          if (state.states) {
            for (const event of state.events) {
              events.add(`${event}`);
            }
          }
        }
      }
      return Array.from(events);
    });
  }

  /**
   * All the events that have transitions directly from this state node.
   *
   * Excludes any inert events.
   */
  get ownEvents() {
    const events = new Set([...this.transitions.keys()].filter(descriptor => {
      return this.transitions.get(descriptor).some(transition => !(!transition.target && !transition.actions.length && !transition.reenter));
    }));
    return Array.from(events);
  }
}

const STATE_IDENTIFIER = '#';
class StateMachine {
  constructor( /** The raw config used to create the machine. */
  config, implementations) {
    this.config = config;
    /** The machine's own version. */
    this.version = void 0;
    this.schemas = void 0;
    this.implementations = void 0;
    /** @internal */
    this.__xstatenode = true;
    /** @internal */
    this.idMap = new Map();
    this.root = void 0;
    this.id = void 0;
    this.states = void 0;
    this.events = void 0;
    this.id = config.id || '(machine)';
    this.implementations = {
      actors: implementations?.actors ?? {},
      actions: implementations?.actions ?? {},
      delays: implementations?.delays ?? {},
      guards: implementations?.guards ?? {}
    };
    this.version = this.config.version;
    this.schemas = this.config.schemas;
    this.transition = this.transition.bind(this);
    this.getInitialSnapshot = this.getInitialSnapshot.bind(this);
    this.getPersistedSnapshot = this.getPersistedSnapshot.bind(this);
    this.restoreSnapshot = this.restoreSnapshot.bind(this);
    this.start = this.start.bind(this);
    this.root = new StateNode(config, {
      _key: this.id,
      _machine: this
    });
    this.root._initialize();
    this.states = this.root.states; // TODO: remove!
    this.events = this.root.events;
  }

  /**
   * Clones this state machine with the provided implementations and merges the
   * `context` (if provided).
   *
   * @param implementations Options (`actions`, `guards`, `actors`, `delays`,
   *   `context`) to recursively merge with the existing options.
   * @returns A new `StateMachine` instance with the provided implementations.
   */
  provide(implementations) {
    const {
      actions,
      guards,
      actors,
      delays
    } = this.implementations;
    return new StateMachine(this.config, {
      actions: {
        ...actions,
        ...implementations.actions
      },
      guards: {
        ...guards,
        ...implementations.guards
      },
      actors: {
        ...actors,
        ...implementations.actors
      },
      delays: {
        ...delays,
        ...implementations.delays
      }
    });
  }
  resolveState(config) {
    const resolvedStateValue = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.r)(this.root, config.value);
    const nodeSet = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.i)((0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.j)(this.root, resolvedStateValue));
    return (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.k)({
      _nodes: [...nodeSet],
      context: config.context || {},
      children: {},
      status: (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.l)(nodeSet, this.root) ? 'done' : config.status || 'active',
      output: config.output,
      error: config.error,
      historyValue: config.historyValue
    }, this);
  }

  /**
   * Determines the next snapshot given the current `snapshot` and received
   * `event`. Calculates a full macrostep from all microsteps.
   *
   * @param snapshot The current snapshot
   * @param event The received event
   */
  transition(snapshot, event, actorScope) {
    return (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.n)(snapshot, event, actorScope).snapshot;
  }

  /**
   * Determines the next state given the current `state` and `event`. Calculates
   * a microstep.
   *
   * @param state The current state
   * @param event The received event
   */
  microstep(snapshot, event, actorScope) {
    return (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.n)(snapshot, event, actorScope).microstates;
  }
  getTransitionData(snapshot, event) {
    return (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.o)(this.root, snapshot.value, snapshot, event) || [];
  }

  /**
   * The initial state _before_ evaluating any microsteps. This "pre-initial"
   * state is provided to initial actions executed in the initial state.
   */
  getPreInitialState(actorScope, initEvent, internalQueue) {
    const {
      context
    } = this.config;
    const preInitial = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.k)({
      context: typeof context !== 'function' && context ? context : {},
      _nodes: [this.root],
      children: {},
      status: 'active'
    }, this);
    if (typeof context === 'function') {
      const assignment = ({
        spawn,
        event,
        self
      }) => context({
        spawn,
        input: event.input,
        self
      });
      return (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.p)(preInitial, initEvent, actorScope, [(0,_log_4a38a98a_esm_js__WEBPACK_IMPORTED_MODULE_2__.a)(assignment)], internalQueue);
    }
    return preInitial;
  }

  /**
   * Returns the initial `State` instance, with reference to `self` as an
   * `ActorRef`.
   */
  getInitialSnapshot(actorScope, input) {
    const initEvent = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.q)(input); // TODO: fix;
    const internalQueue = [];
    const preInitialState = this.getPreInitialState(actorScope, initEvent, internalQueue);
    const nextState = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.s)([{
      target: [...(0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.u)(this.root)],
      source: this.root,
      reenter: true,
      actions: [],
      eventType: null,
      toJSON: null // TODO: fix
    }], preInitialState, actorScope, initEvent, true, internalQueue);
    const {
      snapshot: macroState
    } = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.n)(nextState, initEvent, actorScope, internalQueue);
    return macroState;
  }
  start(snapshot) {
    Object.values(snapshot.children).forEach(child => {
      if (child.getSnapshot().status === 'active') {
        child.start();
      }
    });
  }
  getStateNodeById(stateId) {
    const fullPath = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.v)(stateId);
    const relativePath = fullPath.slice(1);
    const resolvedStateId = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.w)(fullPath[0]) ? fullPath[0].slice(STATE_IDENTIFIER.length) : fullPath[0];
    const stateNode = this.idMap.get(resolvedStateId);
    if (!stateNode) {
      throw new Error(`Child state node '#${resolvedStateId}' does not exist on machine '${this.id}'`);
    }
    return (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.x)(stateNode, relativePath);
  }
  get definition() {
    return this.root.definition;
  }
  toJSON() {
    return this.definition;
  }
  getPersistedSnapshot(snapshot, options) {
    return (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.y)(snapshot, options);
  }
  restoreSnapshot(snapshot, _actorScope) {
    const children = {};
    const snapshotChildren = snapshot.children;
    Object.keys(snapshotChildren).forEach(actorId => {
      const actorData = snapshotChildren[actorId];
      const childState = actorData.snapshot;
      const src = actorData.src;
      const logic = typeof src === 'string' ? (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.z)(this, src) : src;
      if (!logic) {
        return;
      }
      const actorRef = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.A)(logic, {
        id: actorId,
        parent: _actorScope.self,
        syncSnapshot: actorData.syncSnapshot,
        snapshot: childState,
        src,
        systemId: actorData.systemId
      });
      children[actorId] = actorRef;
    });
    const restoredSnapshot = (0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.k)({
      ...snapshot,
      children,
      _nodes: Array.from((0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.i)((0,_State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.j)(this.root, snapshot.value)))
    }, this);
    let seen = new Set();
    function reviveContext(contextPart, children) {
      if (seen.has(contextPart)) {
        return;
      }
      seen.add(contextPart);
      for (let key in contextPart) {
        const value = contextPart[key];
        if (value && typeof value === 'object') {
          if ('xstate$$type' in value && value.xstate$$type === _State_cdbc7940_esm_js__WEBPACK_IMPORTED_MODULE_1__.$) {
            contextPart[key] = children[value.id];
            continue;
          }
          reviveContext(value, children);
        }
      }
    }
    reviveContext(restoredSnapshot.context, children);
    return restoredSnapshot;
  }
}

/**
 * Asserts that the given event object is of the specified type or types. Throws
 * an error if the event object is not of the specified types.
 *
 * @example
 *
 * ```ts
 * // ...
 * entry: ({ event }) => {
 *   assertEvent(event, 'doNothing');
 *   // event is { type: 'doNothing' }
 * },
 * // ...
 * exit: ({ event }) => {
 *   assertEvent(event, 'greet');
 *   // event is { type: 'greet'; message: string }
 *
 *   assertEvent(event, ['greet', 'notify']);
 *   // event is { type: 'greet'; message: string }
 *   // or { type: 'notify'; message: string; level: 'info' | 'error' }
 * },
 * ```
 */
function assertEvent(event, type) {
  const types = toArray(type);
  if (!types.includes(event.type)) {
    const typesText = types.length === 1 ? `type "${types[0]}"` : `one of types "${types.join('", "')}"`;
    throw new Error(`Expected event ${JSON.stringify(event)} to have ${typesText}`);
  }
}

// this is not 100% accurate since we can't make parallel regions required in the result
// `TTestValue` doesn't encode this information anyhow for us to be able to do that
// this is fine for most practical use cases anyway though
/**
 * Creates a state machine (statechart) with the given configuration.
 *
 * The state machine represents the pure logic of a state machine actor.
 *
 * @example
 *
 * ```ts
 * import { createMachine } from 'xstate';
 *
 * const lightMachine = createMachine({
 *   id: 'light',
 *   initial: 'green',
 *   states: {
 *     green: {
 *       on: {
 *         TIMER: { target: 'yellow' }
 *       }
 *     },
 *     yellow: {
 *       on: {
 *         TIMER: { target: 'red' }
 *       }
 *     },
 *     red: {
 *       on: {
 *         TIMER: { target: 'green' }
 *       }
 *     }
 *   }
 * });
 *
 * const lightActor = createActor(lightMachine);
 * lightActor.start();
 *
 * lightActor.send({ type: 'TIMER' });
 * ```
 *
 * @param config The state machine configuration.
 * @param options DEPRECATED: use `setup({ ... })` or `machine.provide({ ... })`
 *   to provide machine implementations instead.
 */
function createMachine(config, implementations) {
  return new StateMachine(config, implementations);
}

/** @internal */
function createInertActorScope(actorLogic) {
  const self = createActor(actorLogic);
  const inertActorScope = {
    self,
    defer: () => {},
    id: '',
    logger: () => {},
    sessionId: '',
    stopChild: () => {},
    system: self.system,
    emit: () => {}
  };
  return inertActorScope;
}
function getInitialSnapshot(actorLogic, ...[input]) {
  const actorScope = createInertActorScope(actorLogic);
  return actorLogic.getInitialSnapshot(actorScope, input);
}

/**
 * Determines the next snapshot for the given `actorLogic` based on the given
 * `snapshot` and `event`.
 *
 * If the `snapshot` is `undefined`, the initial snapshot of the `actorLogic` is
 * used.
 *
 * @example
 *
 * ```ts
 * import { getNextSnapshot } from 'xstate';
 * import { trafficLightMachine } from './trafficLightMachine.ts';
 *
 * const nextSnapshot = getNextSnapshot(
 *   trafficLightMachine, // actor logic
 *   undefined, // snapshot (or initial state if undefined)
 *   { type: 'TIMER' }
 * ); // event object
 *
 * console.log(nextSnapshot.value);
 * // => 'yellow'
 *
 * const nextSnapshot2 = getNextSnapshot(
 *   trafficLightMachine, // actor logic
 *   nextSnapshot, // snapshot
 *   { type: 'TIMER' }
 * ); // event object
 *
 * console.log(nextSnapshot2.value);
 * // =>'red'
 * ```
 */
function getNextSnapshot(actorLogic, snapshot, event) {
  const inertActorScope = createInertActorScope(actorLogic);
  inertActorScope.self._snapshot = snapshot;
  return actorLogic.transition(snapshot, event, inertActorScope);
}

// at the moment we allow extra actors - ones that are not specified by `children`
// this could be reconsidered in the future
function setup({
  schemas,
  actors,
  actions,
  guards,
  delays
}) {
  return {
    createMachine: config => createMachine({
      ...config,
      schemas
    }, {
      actors,
      actions,
      guards,
      delays
    })
  };
}

/**
 * Returns a promise that resolves to the `output` of the actor when it is done.
 *
 * @example
 *
 * ```ts
 * const machine = createMachine({
 *   // ...
 *   output: {
 *     count: 42
 *   }
 * });
 *
 * const actor = createActor(machine);
 *
 * actor.start();
 *
 * const output = await toPromise(actor);
 *
 * console.log(output);
 * // logs { count: 42 }
 * ```
 */
function toPromise(actor) {
  return new Promise((resolve, reject) => {
    actor.subscribe({
      complete: () => {
        resolve(actor.getSnapshot().output);
      },
      error: reject
    });
  });
}

const defaultWaitForOptions = {
  timeout: Infinity // much more than 10 seconds
};

/**
 * Subscribes to an actor ref and waits for its emitted value to satisfy a
 * predicate, and then resolves with that value. Will throw if the desired state
 * is not reached after an optional timeout. (defaults to Infinity).
 *
 * @example
 *
 * ```js
 * const state = await waitFor(someService, (state) => {
 *   return state.hasTag('loaded');
 * });
 *
 * state.hasTag('loaded'); // true
 * ```
 *
 * @param actorRef The actor ref to subscribe to
 * @param predicate Determines if a value matches the condition to wait for
 * @param options
 * @returns A promise that eventually resolves to the emitted value that matches
 *   the condition
 */
function waitFor(actorRef, predicate, options) {
  const resolvedOptions = {
    ...defaultWaitForOptions,
    ...options
  };
  return new Promise((res, rej) => {
    let done = false;
    const handle = resolvedOptions.timeout === Infinity ? undefined : setTimeout(() => {
      sub.unsubscribe();
      rej(new Error(`Timeout of ${resolvedOptions.timeout} ms exceeded`));
    }, resolvedOptions.timeout);
    const dispose = () => {
      clearTimeout(handle);
      done = true;
      sub?.unsubscribe();
    };
    function checkEmitted(emitted) {
      if (predicate(emitted)) {
        dispose();
        res(emitted);
      }
    }
    let sub; // avoid TDZ when disposing synchronously

    // See if the current snapshot already matches the predicate
    checkEmitted(actorRef.getSnapshot());
    if (done) {
      return;
    }
    sub = actorRef.subscribe({
      next: checkEmitted,
      error: err => {
        dispose();
        rej(err);
      },
      complete: () => {
        dispose();
        rej(new Error(`Actor terminated without satisfying predicate`));
      }
    });
    if (done) {
      sub.unsubscribe();
    }
  });
}




/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(54709));
/******/ }
]);