import Plotly from "plotly.js-dist-min"
import { integrate, stepEuler } from './ode_solver'


// time grid
const tMax = 20.0
const dt = 0.01
const time: number[] = []
for (let t = 0; t <= tMax; t += dt) {
    time.push(t)
}


// グラフを更新する関数
function updatePlot() {

    // テキストボックスから値を取得
    const mass = Number(document.getElementById("mass")!.value)
    const springConstant = Number(document.getElementById("springConstant")!.value)
    const x0 = Number(document.getElementById("x0")!.value)
    const v0 = Number(document.getElementById("v0")!.value)

    // 運動方程式
    const f = (t: number, y: number[]): number[] => {
        const x = y[0]
        const v = y[1]
        return [v, -(springConstant / mass) * x]
    }

    // 数値的に解く
    const Y = integrate(f, time, [x0, v0])
    // const Y = integrate(f, time, [x0, v0], stepEuler)
        const x: number[] = []
        for (let i = 0; i < time.length; i++) {
            x.push(Y[i][0])
        }

    // 解析解
    const omega = Math.sqrt(springConstant / mass)
    const x_: number[] = []
    for (const t of time) {
        const xt =
            x0 * Math.cos(omega * t)
            + v0 / omega * Math.sin(omega * t)
        x_.push(xt)
    }

    // Plotlyでプロット
    const data = [
    {
        x: time,
        y: x_,
        name: "Exact",
        mode: "lines"
    },
    {
        x: time,
        y: x,
        name: "ODE",
        mode: "lines"
    },
    ]
    Plotly.newPlot("plot", data)
}


// 「更新」ボタンを押したとき
document.getElementById("update")!.addEventListener("click", updatePlot)


updatePlot()

