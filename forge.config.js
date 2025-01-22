const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: [
      "images/icon.png",
      "images/icon.svg",
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: "chatium",
          productName: "Chatium",
          maintainer: "stanfieldr",
          homepage: "https://github.com/stanfieldr/chatium#readme",
          icon: "images/icon.png",
          categories: ["Network"]
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          icon: {
            "scalable": "images/icon.svg",
            "512x512": "images/icon.png",
          },
          // defaults: ipc    network    pulseaudio    x11    dri    file access [1]    dbus access [2]
          // todo why
          finishArgs: [
            "--share=ipc",
            "--share=network",
            "--device=dri",
            "--socket=x11",
            "--socket=session-bus",
            "--socket=system-bus",
            "--socket=pulseaudio",
          ]
        }
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
