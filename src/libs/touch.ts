import { os } from "@/utils/common";

export type MoveReturn = {
    offset: {
        x: number,
        y: number,
    },
    // move 的坐标
    position: { x: number, y: number }
}
interface TouchProps {
    target: string | HTMLDivElement;
    hover?: boolean;
    onStart?: (position: { x: number, y: number }) => {};
    onMove?: (position: MoveReturn) => void;
    onUp?: (position: MoveReturn) => void;
}

/**
 * 监听某个元素的鼠标和手指 touch 事件
 * @param { String | Dom } target 要监听的元素 id | class | Dom
 * @param { Function } startHandler 开始事件（返回点击的位置）
 * @param { Function } moveHandler 移动事件（返回从开始到当前移动位置的偏移量 & 当前移动到的位置：{ offset: { x, y }, position: { x, y } }）
 * @param { Function } upHandler 抬起事件（返回从开始到当前抬起位置的偏移量 & 当前抬起的位置：{ offset: { x, y }, position: { x, y } }）
 */
class Touch {
    // 监听的元素
    container:HTMLDivElement = null;

    // 开始事件
    startHandler: TouchProps["onStart"] = null;
    // 移动事件
    moveHandler: TouchProps["onMove"] = null;
    // 抬起事件
    upHandler: TouchProps["onUp"] = null;
    hover = false;

    // 开始位置
    startPosition = {
        x: 0,
        y: 0,
    }

    constructor(params: TouchProps) {
        this.container = typeof params.target === "string" ? document.querySelector<HTMLDivElement>(params.target) : params.target;
        this.startHandler = params.onStart;
        this.moveHandler = params.onMove;
        this.upHandler = params.onUp;
        this.hover = params.hover;
        this.listenStart();

        // 如果 hover 开启了，就一直监听 move
        if (this.hover) this.listenMove();
    }
    listenStart() {
        if (!this.startHandler && !this.moveHandler && !this.upHandler) return;

        if (os.isPc) {
            this.container.addEventListener("mousedown", this.start, false);
            document.body.addEventListener("mouseup", this.up, false);
        } else {
            this.container.addEventListener("touchstart", this.start, false);
            document.body.addEventListener("touchend", this.up, false);
        }
    }
    listenMove = () => {
        if (!this.moveHandler) return;
        this.unListenMove();
        if (os.isPc) {
            this.container.addEventListener("mousemove", this.move, false);
        } else {
            this.container.addEventListener("touchmove", this.move, false);
        }
    }
    unListenMove = () => {
        if (os.isPc) {
            this.container.removeEventListener("mousemove", this.move, false);
        } else {
            this.container.removeEventListener("touchmove", this.move, false);
        }
    }
    start = (e: MouseEvent | TouchEvent) => {
        var state = this.getPosition(e);
        this.startPosition = { x: state.pageX, y: state.pageY };
        if (this.startHandler) this.startHandler({ x: state.pageX, y: state.pageY });

        this.listenMove();
    }
    move = (e: MouseEvent | TouchEvent) => {

        var state = this.getPosition(e);
        const startPosition = this.startPosition;

        // 偏移量 和 move 的坐标传给 moveHandler
        requestAnimationFrame(this.moveHandler.bind(null, {
            // 偏移量
            offset: {
                x: state.pageX - startPosition.x,
                y: state.pageY - startPosition.y,
            },
            // move 的坐标
            position: { x: state.pageX, y: state.pageY }
        }))
    }
    up = (e: MouseEvent | TouchEvent) => {
        if (!this.hover) this.unListenMove();

        if (!this.upHandler) return;
        var state = this.getPosition(e);

        this.upHandler({
            // 偏移量
            offset: {
                x: state.pageX - this.startPosition.x,
                y: state.pageY - this.startPosition.y,
            },
            // move 的坐标
            position: { x: state.pageX, y: state.pageY }
        })
    }
    getPosition(e: MouseEvent | TouchEvent) {
        if ("pageX" in e) return e;
        if ("changedTouches" in e && e.changedTouches) return e.changedTouches[0];
        // if ("nativeEvent" in e) return e.nativeEvent.changedTouches[0];
        return { pageX: 0, pageY: 0 };
    }
}

export default Touch;