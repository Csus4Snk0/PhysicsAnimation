import Plotly from "plotly.js-dist-min"
import { integrate } from './ode_solver'


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
    const mass = Number((document.getElementById("mass") as HTMLInputElement).value)
    const springConstant = Number((document.getElementById("springConstant") as HTMLInputElement).value)
    const x0 = Number((document.getElementById("x0") as HTMLInputElement).value)
    const v0 = Number((document.getElementById("v0") as HTMLInputElement).value)


    // 運動方程式
    const f = (_t: number, y: number[]): number[] => {
        const x = y[0]
        const v = y[1]
        return [v, -(springConstant / mass) * x]
    }

    // 数値的に解く
    const Y = integrate(f, time, [x0, v0])
    // const Y = integrate(f, time, [x0, v0], stepEuler)
    const x: number[] = []
    const v: number[] = []
    for (let i = 0; i < time.length; i++) {
        x.push(Y[i][0])
        v.push(Y[i][1])
    }

    const energy: number[] = []
    for (let i = 0; i < time.length; i++) {
        const xi = x[i]
        const vi = v[i]
        energy.push(
            0.5 * mass * vi ** 2
            + 0.5 * springConstant * xi ** 2
        )
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


    // プロット内容を選択
    const quantity = (document.getElementById("quantity") as HTMLSelectElement).value
    let y: number[]
    let yTitle: string

    if (quantity === "position") {
       y = x
       yTitle = "position"
    } else if (quantity === "velocity") {
       y = v
       yTitle = "velocity"
    } else {
       y = energy
       yTitle = "energy"
    }

    // Plotlyでプロット
    const data = [
    {
        x: time,
        y: x_,
        name: "Exact position",
        mode: "lines"
    },
    {
        x: time,
        y: y,
        name: `ODE ${yTitle}`,
        mode: "lines"
    },
    ]
    Plotly.newPlot("plot", data)
}


// GUI設定
document.getElementById("update")!.addEventListener("click", updatePlot)
document.getElementById("quantity")!.addEventListener("change", updatePlot)

updatePlot()

