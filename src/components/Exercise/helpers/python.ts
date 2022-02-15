import { Result } from "../../../generated/globalTypes";

declare var Sk: any;

const OUTPUTS = [];

function builtinRead(x: any) {
  if (
    Sk.builtinFiles === undefined ||
    Sk.builtinFiles["files"][x] === undefined
  )
    throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

interface RunPythonI {
  code: string;
  setLoading: (v: boolean) => void;
  setOutput: (v: string) => void;
  setResult: (v: Result) => void;
  stopExecution: { current: boolean };
  onSuccess?: Function;
  onError?: (v: string) => void;
  getInput: () => string;
  onFinish?: (error?: any) => void;
  moreThanOneExecution?: boolean;
}

const runPython = ({
  code,
  setLoading,
  setOutput,
  setResult,
  stopExecution,
  onSuccess,
  onError,
  getInput,
  onFinish,
  moreThanOneExecution,
}: RunPythonI) => {
  console.log("[SKULPT]", code);
  Sk.pre = "output";
  Sk.configure({
    output: setOutput,
    __future__: Sk.python3,
    read: builtinRead,

    // Exec limit sometimes does not fire
    execLimit: 10000,

    // Added to enable the execution stop
    killableWhile: true,
    killableFor: true,

    inputfun: getInput,
    inputfunTakesPrompt: true,
  });
  //   (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "mycanvas";
  var myPromise = Sk.misceval.asyncToPromise(
    () => Sk.importMainWithBody("<stdin>", false, code, true),
    {
      // handle a suspension of the executing code
      // "*" says handle all types of suspensions
      "*": () => {
        console.log("CHECK", stopExecution.current);
        if (stopExecution.current) {
          throw "\nExecution interrupted";
        }
      },
    }
  );

  setLoading(true);
  myPromise.then(
    function (mod: any) {
      console.log("success", mod);

      setResult(Result.ACCEPT);
      setLoading(false);
      onSuccess && onSuccess();
      onFinish && onFinish();
    },
    function (err: any) {
      //   console.log("errrr", err);
      //   console.log(err.toString());
      onError && onError(err.toString() + "\n");

      console.log("ERR", JSON.stringify(err));
      setResult(Result.RUNTIME_ERROR);
      setLoading(false);
      setOutput(err.toString() + "\n");
      onFinish && onFinish(err.toString() + "\n");
    }
  );
};

function outf(text: string) {
  console.log("RUN", text);
}

export default runPython;
