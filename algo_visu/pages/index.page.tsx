import { useMount } from "ahooks";
import { extension } from "common/util";
import { runInAction, makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { AlgorithmApi, TracerApi } from "apis";
import { GetServerSideProps } from "next";
import axios, { CancelTokenSource } from "axios";
import { ProgressBar, VisualizationViewer } from "components";
import { Button, Slider } from "antd";
import {
  HomeOutlined,
  LeftOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RightOutlined,
  ToolOutlined,
} from "@ant-design/icons";

export const getServerSideProps: GetServerSideProps = async function (context) {
  return {
    props: { ready: true }, // will be passed to the page component as props
  };
};

class Player {
  loading = false;
  speed = 2;
  playing = false;
  cursor = 0;
  filename: string = process.env.NEXT_PUBLIC_FILENAME || "main.cpp";
  chunks: any[] = [];
  lineIndicator: any = undefined;
  timer?: NodeJS.Timeout;
  tracerApiSource?: CancelTokenSource;

  constructor() {
    makeAutoObservable(this);
  }

  build = async () => {
    this.loading = true;
    try {
      this.reset();
      if (this.tracerApiSource) this.tracerApiSource.cancel();
      this.tracerApiSource = axios.CancelToken.source();
      const res = await AlgorithmApi.getAlgorithm(this.filename);
      const ext = extension(this.filename);
      const code = res.data.file as string;
      if (ext in TracerApi) {
        const commands = await TracerApi[ext as "cpp" | "js"](
          { code },
          this.tracerApiSource.token
        );
        this.reset(commands);
        this.next();
      } else {
        console.log("Language Not Supported");
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  reset = (commands: any[] = []) => {
    const chunks: any[] = [
      {
        commands: [],
        lineNumber: undefined,
      },
    ];
    while (commands.length) {
      const command = commands.shift();
      const { key, method, args } = command;
      if (key === null && method === "delay") {
        const [lineNumber] = args;
        chunks[chunks.length - 1].lineNumber = lineNumber;
        chunks.push({
          commands: [],
          lineNumber: undefined,
        });
      } else {
        chunks[chunks.length - 1].commands.push(command);
      }
    }
    runInAction(() => {
      this.chunks = chunks;
      this.cursor = 0;
      this.lineIndicator = undefined;
    });
    this.pause();
  };

  pause = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;

      this.playing = false;
    }
  };

  isValidCursor = (cursor: number) => {
    return 1 <= cursor && cursor <= this.chunks.length;
  };

  prev = () => {
    this.pause();
    const cursor = this.cursor - 1;
    if (!this.isValidCursor(cursor)) return false;
    this.cursor = cursor;
    return true;
  };

  resume = (wrap = false) => {
    this.pause();
    if (wrap) this.cursor = 1;
    if (this.next()) {
      const interval = 4000 / Math.pow(Math.E, this.speed);
      this.timer = setTimeout(() => this.resume(), interval);
      this.playing = true;
    }
  };

  play = () => {
    this.resume(true);
  };

  next = () => {
    this.pause();
    const cursor = this.cursor + 1;

    if (!this.isValidCursor(cursor)) return false;
    this.cursor = cursor;
    return true;
  };

  onChangeProgress = (progress: number) => {
    const cursor = Math.max(
      1,
      Math.min(this.chunks.length, Math.round(progress * this.chunks.length))
    );
    this.pause();
    this.cursor = cursor;
  };

  onChangeSpeed = (speed: number) => {
    this.speed = speed;
  };
}

const Index = observer<{ player: Player }>(({ player }) => {
  useMount(player.build);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col md:flex-row">
        <div className="flex">
          <Button
            className="w-28 justify-center"
            icon={<ToolOutlined />}
            loading={player.loading}
            disabled={player.loading}
            onClick={player.build}
          >
            {player.loading ? "Building" : "Build"}
          </Button>
          {player.playing ? (
            <Button
              className="w-24 justify-center"
              icon={<PauseCircleOutlined />}
              onClick={player.pause}
            >
              Pause
            </Button>
          ) : (
            <Button
              className="w-24 justify-center"
              icon={<PlayCircleOutlined />}
              onClick={player.play}
            >
              Play
            </Button>
          )}
          <Button
            disabled={!player.isValidCursor(player.cursor - 1)}
            onClick={player.prev}
          >
            <LeftOutlined />
          </Button>
          <ProgressBar
            className="w-40"
            current={player.cursor}
            total={player.chunks.length}
            onChangeProgress={player.onChangeProgress}
          />
          <Button
            disabled={!player.isValidCursor(player.cursor + 1)}
            onClick={player.next}
          >
            <RightOutlined />
          </Button>
        </div>
        <div className="flex items-center mt-3 md:mt-0 w-full md:w-48 px-3">
          Speed
          <Slider
            className="flex-1"
            min={0}
            max={4}
            step={0.1}
            value={player.speed}
            onChange={player.onChangeSpeed}
          />
        </div>
      </div>
      <VisualizationViewer
        player={{ chunks: player.chunks, cursor: player.cursor }}
      />
    </div>
  );
});

export default function Page() {
  return <Index player={new Player()} />;
}
