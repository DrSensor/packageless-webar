export default async function (options) {
    const video = document.getElementById('skybox')
    const mediastream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: 'environment',
            ...options,
        },
    })
    video.srcObject = mediastream
    return video
}
