
import { exec } from 'child_process'

let modules: { module_name: string; version: string }[] = []
let mcVersion: string
let versions: string[]

console.log("Reading manifest.json to get minecraft version and modules version")
exec('cat manifest.json', (_, stdout) => {
    let o = JSON.parse(stdout)
    mcVersion = o.header.min_engine_version.join('.')
    o.dependencies.map((dependency: any) => {
        const { module_name, version } = dependency
        if (!module_name) return
        modules.push({ module_name, version })
    })

    console.log("Installing dependencies");
    modules.forEach(m => {
        exec(`npm v ${m.module_name} versions --json`, (_, stdout) => {
            let o = JSON.parse(stdout)
            let a: string[] = []
            versions = o
            versions.map((v: string) => {
                if (v.includes(mcVersion)) {
                    if (v.includes(modules[0].version)) {
                        a.push(v)
                    }
                }
            })

            console.log(`Installing ${m.module_name} ${m.version}`);

            exec(`npm i ${m.module_name}@${a.reverse()[0]} --save-dev`, (_, stdout) => {
                console.log(stdout)
            })
        })
    })
})