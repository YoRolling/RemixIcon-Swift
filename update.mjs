import 'zx/globals'
import ora, { oraPromise } from 'ora'
const TEMP_DIR = 'RemixIcon'
const ASSETS_DIR = 'Sources/RemixIcon/Assets.xcassets'
const UPSTREAM_REPO = 'https://github.com/Remix-Design/RemixIcon.git'

/**
 * 创建 xcassets 目录
 *
 * @returns Promise<void>
 */
async function makeXcAssetsDir() {
  const spinner = ora("Making 'Sources/RemixIcon/Assets.xcassets'...").start()
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true })
  } else {
    fs.rmSync(ASSETS_DIR, { recursive: true, force: true })
    fs.mkdirSync(ASSETS_DIR, { recursive: true })
  }
  spinner.succeed("Made 'Sources/RemixIcon/Assets.xcassets'")
  spinner.stop()
}
/**
 * 从上游仓库检出 RemixIcon
 *
 * @returns Promise<void>
 */
async function checkoutUpstream() {
  const spinner = ora('Downloading RemixIcon...').start()
  try {
    await $`git clone --depth 1 --filter=blob:none --no-checkout "${UPSTREAM_REPO}" "${TEMP_DIR}"`.quiet()
    await $`git -C "${TEMP_DIR}" sparse-checkout init --cone`.quiet()
    await $`git -C "${TEMP_DIR}" sparse-checkout set icons`.quiet()
    await $`git -C "${TEMP_DIR}" checkout master`.quiet()
    spinner.succeed('Downloaded RemixIcon').stop()
  } catch (error) {
    spinner.fail('Error while clone RemixIcon:  ' + error).stop()
    await cleanup()
    process.exit(1)
  }
}
/**
 * 清理临时文件夹
 *
 * @returns Promise<void>
 */
async function cleanup() {
  await oraPromise($`rm -rf ${TEMP_DIR}`.quiet(), {
    text: 'Cleaning up...',
    successText: 'Cleaned up',
    failText: 'Error while cleaning up',
  })
}

/**
 * 处理SVG文件
 *
 * @returns Promise<void>
 */
async function processSVG() {
  const loader = ora('Processing RemixIcon SVG files...').start()
  try {
    const files = glob.globbySync('RemixIcon/icons/**/*.svg')
    const promises = files.map(createAssets)
    await Promise.all(promises)
    loader.succeed('Processed RemixIcon SVG files').stop()
  } catch (error) {
    loader
      .fail('Error while processing RemixIcon SVG files:  ' + chalk.red(error))
      .stop()
  }
}
/**
 * Create assets for a RemixIcon SVG file.
 * @param {string} svgFilePath - The path to the SVG file.
 */
async function createAssets(svgFilePath) {
  try {
    const iconName = path.basename(svgFilePath, '.svg')
    const targetDir = path.join(
      'Sources/RemixIcon/Assets.xcassets',
      `${iconName}.imageset`
    )

    const targetContents = {
      images: [
        { idiom: 'universal', filename: `${iconName}.svg`, scale: '1x' },
        { idiom: 'universal', scale: '2x' },
        { idiom: 'universal', scale: '3x' },
      ],
      info: { author: 'xcode', version: 1 },
    }

    const targetContentsPath = path.join(targetDir, 'Contents.json')
    const targetContentsJSON = JSON.stringify(targetContents, null, 2)
    await fs.promises.mkdir(targetDir, { recursive: true })
    await Promise.all([
      fs.promises.writeFile(targetContentsPath, targetContentsJSON),
      fs.promises.copyFile(
        svgFilePath,
        path.join(targetDir, `${iconName}.svg`)
      ),
    ])
  } catch (error) {
    console.log('createAssets >>>', error)
  }
}

function convertToCamelCase(fileName) {
  // 清理文件名：只保留字母、数字和短横线，然后将连续的短横线和空白字符替换为单个空白字符
  const fileNameClean = fileName
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, ' ')
    .trim()
    .toLowerCase()

  // 将文件名拆分为单词，并转换为驼峰格式
  const words = fileNameClean.split(' ')
  return words
    .map((word, index) => {
      return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join('')
}

async function generateIconsEnum() {
  const spinner = ora('Generating RemixIcon enum...').start()
  try {
    const files = glob
      .globbySync('Sources/RemixIcon/Assets.xcassets/**/*.svg')
      .map((file) => path.basename(file, '.svg'))
    const enumName = 'RemixIcon' // 命名空间

    const enumValue = files
      .map((file) => {
        let iconCase = convertToCamelCase(file)
        if (
          [
            'import',
            'default',
            'case',
            'var',
            'let',
            'class',
            'struct',
            'func',
            'enum',
            'repeat',
            'await',
            'async',
            'subscript',
          ].includes(iconCase)
        ) {
          iconCase = `${iconCase}Icon`
        } else if (Number.isInteger(parseInt(iconCase, 10))) {
          iconCase = `icon${iconCase}`
        }
        return `case ${iconCase} = "${file}"`
      })
      .join('\n  ')
    const enumContents = `public enum  ${enumName}: String, CaseIterable {      \n  ${enumValue}\n}`
    const enumPath = path.join(ASSETS_DIR, '..', 'Icons.swift')
    await fs.promises.writeFile(enumPath, enumContents)
    spinner.succeed('Generated RemixIcon enum').stop()
  } catch (error) {}
}
;(async function main() {
  console.log(chalk.bgAnsi256(36).blue.bold.italic(`Let's update RemixIcon!`))
  await makeXcAssetsDir()
  try {
    await checkoutUpstream()
    await processSVG()
    await generateIconsEnum()
    await cleanup()
  } catch (error) {
    console.error('Error while updating RemixIcon', error)
    await cleanup()
    process.exit(1)
  }
})()
