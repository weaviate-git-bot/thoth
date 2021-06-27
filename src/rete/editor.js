import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import TaskPlugin from "./plugins/taskPlugin";
import { MyNode } from "../components/Node";
import { InputComponent } from "./components/InputComponent";
import { TenseTransformer } from "./components/TenseTransformer";
import { RunInputComponent } from "./components/RunInputComponent";
import { ActionTypeComponent } from "./components/ActionType";
import { ItemTypeComponent } from "./components/ItemDetector";
import { DifficultyDetectorComponent } from "./components/DifficultyDetector";
import { EntityDetector } from "./components/EntityDetector";
import { SafetyVerifier } from "./components/SafetyVerifier";
import { BooleanGate } from "./components/BooleanGate";
import { TimeDetectorComponent } from "./components/TimeDetector";
import { Alert } from "./components/AlertMessage";
import { SwitchGate } from "./components/SwitchGate";
import { PlaytestPrint } from "./components/PlaytestPrint";
import { PlaytestInput } from "./components/PlaytestInput";

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/
const editor = async function (container, pubSub) {
  // Here we load up all components of the builder into our editor for usage.
  // We might be able to programatically generate components from enki
  const components = [
    new ActionTypeComponent(),
    new Alert(),
    new BooleanGate(),
    new DifficultyDetectorComponent(),
    new EntityDetector(),
    new InputComponent(),
    new ItemTypeComponent(),
    new PlaytestPrint(),
    new PlaytestInput(),
    new RunInputComponent(),
    new SafetyVerifier(),
    new SwitchGate(),
    new TenseTransformer(),
    new TimeDetectorComponent(),
  ];

  // create the main edtor
  const editor = new Rete.NodeEditor("demo@0.1.0", container);

  // Set up the reactcontext pubsub on the editor so rete components can talk to react
  editor.pubSub = pubSub;

  // PLUGINS
  //https://github.com/retejs/comment-plugin
  // connection plugin is used to render conections between nodes
  editor.use(ConnectionPlugin);

  // React rendering for the editor
  editor.use(ReactRenderPlugin, {
    // MyNode is a custom default style for nodes
    component: MyNode,
  });

  // renders a context menu on right click that shows available nodes
  editor.use(ContextMenuPlugin);

  editor.use(TaskPlugin);

  // The engine is used to process/run the rete graph
  const engine = new Rete.Engine("demo@0.1.0");

  // Register custom components with both the editor and the engine
  // We will need a wa to share components between client and server
  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  editor.on("zoom", ({ source }) => {
    return source !== "dblclick";
  });

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
      // Then we run the fewshots, etc on the backend rather than on the client.
      // Alterative for now is for the client to call our own /openai endpoint.
      // NOTE need to consider authentication against games API from a web client
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  const defaultState =
    '{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"text":"Input text here","undefined":"Sam"},"inputs":{},"outputs":{"text":{"connections":[{"node":12,"input":"name","data":{}}]}},"position":[74.40924045994934,79.08276852760682],"name":"Input"},"9":{"id":9,"data":{"display":"true"},"inputs":{"string":{"connections":[{"node":13,"output":"text","data":{}}]},"data":{"connections":[{"node":13,"output":"data","data":{}}]}},"outputs":{"boolean":{"connections":[{"node":11,"input":"boolean","data":{}}]},"data":{"connections":[{"node":11,"input":"data","data":{}}]}},"position":[-199.3843239822832,-205.0910954299351],"name":"Safety Verifier"},"11":{"id":11,"data":{},"inputs":{"boolean":{"connections":[{"node":9,"output":"boolean","data":{}}]},"data":{"connections":[{"node":9,"output":"data","data":{}}]}},"outputs":{"true":{"connections":[{"node":12,"input":"data","data":{}}]},"false":{"connections":[]}},"position":[99.11344037443256,-410.6986301163858],"name":"Boolean Gate"},"12":{"id":12,"data":{"display":"Joe walks into the bar."},"inputs":{"data":{"connections":[{"node":11,"output":"true","data":{}}]},"text":{"connections":[{"node":13,"output":"text","data":{}}]},"name":{"connections":[{"node":1,"output":"text","data":{}}]}},"outputs":{"action":{"connections":[]},"data":{"connections":[]}},"position":[426.32063666846057,-244.95964440421992],"name":"Tense Transformer"},"13":{"id":13,"data":{},"inputs":{},"outputs":{"text":{"connections":[{"node":9,"input":"string","data":{}},{"node":12,"input":"text","data":{}}]},"data":{"connections":[{"node":9,"input":"data","data":{}}]}},"position":[-567.2821504111539,-206.93077213491136],"name":"Console Input"}}}';

  // a default editor graph state
  editor.fromJSON(JSON.parse(defaultState));

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");

  return editor;
};

export default editor;
