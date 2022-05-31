import Touch, { MoveReturn } from './touch';

export type HoverType = boolean | {
    angle: number
}

export interface UmbrellaProps {
    world: string | HTMLDivElement;
    scene: string | HTMLDivElement;
    hover?: HoverType
}

class Umbrella {

    containers: NodeListOf<HTMLDivElement> | [HTMLDivElement] | null = null;
    scenes: NodeListOf<HTMLDivElement> | [HTMLDivElement] | null = null;
    speed = .5;

    hover: HoverType = false;
    disable = false;

    containersRotate: { x: number, y: number, z: number }[] = []

    constructor({ world, scene, hover = false }: UmbrellaProps) {
        if (!world) throw new Error('缺少 world 参数！');

        this.containers = typeof world === "string" ? document.querySelectorAll<HTMLDivElement>(world) : [world];
        this.scenes = typeof scene === "string" ? document.querySelectorAll<HTMLDivElement>(scene) : [scene];
        this.hover = hover;

        var _ = this;
        this.containers.forEach(function (target, i) {
            _.containersRotate.push({ x: 0, y: 0, z: 0 });
            if (_.scenes) _.touchListener(target, _.scenes[i], _.containersRotate[i], hover);
        })
    }
    /**
     *
     * @param {Number} range 距离
     * @returns
     */
    slowDown(range: number, speed: number) {
        return range * speed;
    }
    reset = () => {
        if (_.scenes) this.scenes.forEach(function (target, i) {
            target.style.transform = `rotateX(${0}deg) rotateY(${0}deg) rotateZ(0deg)`;
        })
    }
    setDisable = (disable: boolean) => {
        if (disable) {
            this.reset();
            this.disable = true;
        } else this.disable = false;
    }
    getScreenLeft(target: HTMLDivElement) {
        let _target = target;
        let left = 0;
        while (_target.nodeName !== "BODY" && _target.offsetParent) {
            left += _target.offsetLeft;
            _target = _target.offsetParent as HTMLDivElement
        }
        return left
    }
    getScreenTop(target: HTMLDivElement) {
        let _target = target;
        let top = 0;
        while (_target.nodeName !== "BODY" && _target.offsetParent) {
            top += _target.offsetTop;
            _target = _target.offsetParent as HTMLDivElement
        }
        return top
    }
    touchListener(target: HTMLDivElement, scene: HTMLDivElement, rotate: { x: number, y: number }, hover: HoverType) {
        var width = target.clientWidth;
        var height = target.clientHeight;

        var _ = this;
        var _x = rotate.x;
        var _y = rotate.y;
        new Touch({
            target,
            hover: !!hover,
            onMove: function (e) {

                if (_.disable) return;

                if (hover) {
                    const targetRect = target.getBoundingClientRect();

                    const angle = typeof hover === "object" ? hover.angle : 10

                    let widthHalf = width / 2;
                    let yPer = (e.position.x - targetRect.left - widthHalf) / widthHalf
                    _y = angle * yPer;

                    let heightHalf = height / 2;
                    let xPer = (e.position.y - targetRect.top - heightHalf) / heightHalf
                    _x = angle * xPer;
                    scene.style.transform = `rotateX(${_x}deg) rotateY(${_y}deg) rotateZ(0deg)`;
                    return;
                }

                _x = rotate.x - _.slowDown(e.offset.y, _.speed);
                _y = rotate.y + _.slowDown(e.offset.x, _.speed);

                if (_x >= 90) _x = 90;
                if (_x <= -90) _x = -90;
                scene.style.transform = `rotateX(${_x}deg) rotateY(${_y}deg) rotateZ(0deg)`;
            },
            onUp: function () {
                rotate.x = _x;
                rotate.y = _y;
            }
        })
    }
}

export default Umbrella;
