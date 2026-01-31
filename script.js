const video = document.getElementById("webcam");
const canvas = document.getElementById("processor");
const context = canvas.getContext("2d");
const output = document.getElementById("preview")
const height = 60;
const width = 100;
const selectedStyle = document.getElementById("density").value;
const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener("input", () => {
    output.style.color = colorPicker.value;
});

const STYLES = {
    HIGH_CONTRAST: "@%#*+=-:. ",
    ULTRA_DETAILED: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^'. ",
    MID: "N@#W$9876543210?!abc;:+=-,._",
    BLOCKS: "█▓▒░ ",
    MINIMALIST: "#+-."
};

let density = STYLES.BLOCKS;

const charSelector = document.getElementById("density");
charSelector.addEventListener("change", () => {
    const selectedValue = charSelector.value.toUpperCase();
    density = STYLES[selectedValue];
})

navigator.mediaDevices.getUserMedia({ video: true}).then(stream => { video.srcObject = stream; video.play(); convertToASCII() });

function convertToASCII() {
    context.drawImage(video, 0, 0, width, height)
    const pixels = context.getImageData(0, 0, width, height).data;
    let asciiImage = "";
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = (y * width + x) * 4;
            let luminance = 0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2];
            let charIndex = Math.floor((luminance / 255) * (density.length - 1));
            asciiImage += density.charAt(charIndex) + density.charAt(charIndex);
        }
        asciiImage += "\n";
    }
    output.textContent = asciiImage;
    requestAnimationFrame(convertToASCII)
}