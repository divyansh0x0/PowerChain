<template>
    <canvas ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

const canvasRef = ref(null)

const NUM_DOTS = 100
const DOT_RADIUS = 2
const CONNECT_DIST = 80

onMounted(() => {
    const canvas = canvasRef.value
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x181829)
    renderer.setPixelRatio(window.devicePixelRatio)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
        0, window.innerWidth,
        window.innerHeight, 0,
        -1, 1
    )

    // Dot positions
    const dots = Array.from({ length: NUM_DOTS }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseX: 0,
        baseY: 0
    }))

    // Save base position for mouse interaction
    dots.forEach(dot => {
        dot.baseX = dot.x
        dot.baseY = dot.y
    })

    // Mouse
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    })

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.right = window.innerWidth
        camera.bottom = window.innerHeight
        camera.updateProjectionMatrix()
    })

    // Dot mesh (using Points)
    const dotGeom = new THREE.BufferGeometry()
    const dotPositions = new Float32Array(NUM_DOTS * 3)
    dotGeom.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3))
    const dotMat = new THREE.PointsMaterial({ color: 0xffffff, size: DOT_RADIUS })
    const dotMesh = new THREE.Points(dotGeom, dotMat)
    scene.add(dotMesh)

    // Line mesh (using LineSegments)
    const maxConnections = NUM_DOTS * NUM_DOTS
    const lineGeom = new THREE.BufferGeometry()
    const linePositions = new Float32Array(maxConnections * 3 * 2)
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const lineMat = new THREE.LineBasicMaterial({ color: 0x8ecfff, opacity: 0.5, transparent: true })
    const lineMesh = new THREE.LineSegments(lineGeom, lineMat)
    scene.add(lineMesh)

    function animate() {
        // Move dots slightly and react to mouse
        for (let i = 0; i < NUM_DOTS; i++) {
            const dot = dots[i]

            // Gentle drifting
            dot.x += dot.vx
            dot.y += dot.vy

            // Bounce off edges
            if (dot.x < 0 || dot.x > window.innerWidth) dot.vx *= -1
            if (dot.y < 0 || dot.y > window.innerHeight) dot.vy *= -1

            // Mouse repulsion/attraction
            const dx = mouse.x - dot.x
            const dy = mouse.y - dot.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 120) {
                // Move slightly toward/away from mouse
                dot.x += dx * 0.004
                dot.y += dy * 0.004
            }

            dotPositions[i * 3] = dot.x
            dotPositions[i * 3 + 1] = dot.y
            dotPositions[i * 3 + 2] = 0
        }
        dotGeom.attributes.position.needsUpdate = true

        // Lines between close dots
        let ptr = 0
        for (let i = 0; i < NUM_DOTS; i++) {
            for (let j = i + 1; j < NUM_DOTS; j++) {
                const a = dots[i]
                const b = dots[j]
                const dx = a.x - b.x
                const dy = a.y - b.y
                const d = dx * dx + dy * dy
                if (d < CONNECT_DIST * CONNECT_DIST) {
                    // Line from a to b
                    linePositions[ptr++] = a.x
                    linePositions[ptr++] = a.y
                    linePositions[ptr++] = 0
                    linePositions[ptr++] = b.x
                    linePositions[ptr++] = b.y
                    linePositions[ptr++] = 0
                }
            }
        }
        // Clear unused lines
        for (let i = ptr; i < linePositions.length; i++) linePositions[i] = 0
        lineGeom.setDrawRange(0, ptr / 3)
        lineGeom.attributes.position.needsUpdate = true

        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

    animate()
})
</script>

<style scoped>
canvas {
    width: 100vw;
    height: 100vh;
    display: block;
    background: #181829;
}
</style>