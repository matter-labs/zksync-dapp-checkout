module.exports = {
  extends: "@rabsana/semantic-release-rabsana-config",
  branch: "master",
  npmPublish: false,
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        assets: [
          { path: "dist/asset.min.css", label: "CSS distribution" },
          { path: "dist/asset.min.js", label: "JS distribution" },
        ],
      },
      [
        "@semantic-release/exec",
        {
          prepareCmd: "set-version ${nextRelease.version}",
          publishCmd: "publish-package",
        },
      ],
    ],
  ],
};