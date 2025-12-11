'use strict'
const { join, basename } = require('path')
const fs = require('fs')
const { test, before, after } = require('node:test')
const assert = require('node:assert')
const cmdShim = require('cmd-shim')
const readCmdShim = require('..')
const workDir = join(__dirname, basename(__filename, '.js'))
const testShbang = join(workDir, 'test-shbang')
const testShbangCmd = testShbang + '.cmd'
const testShbangPowershell = testShbang + '.ps1'
const testShim = join(workDir, 'test')
const testShimCmd = testShim + '.cmd'
const testShimPowershell = testShim + '.ps1'

before(async () => {
  fs.rmSync(workDir, { recursive: true, force: true })
  fs.mkdirSync(workDir)
  fs.writeFileSync(testShbang + '.js', '#!/usr/bin/env node\ntrue')
  await Promise.all([
    cmdShim(__filename, testShim),
    cmdShim(testShbang + '.js', testShbang),
  ])
})

test('async-read-no-shebang', async () => {
  assert.strictEqual(await readCmdShim(testShimCmd), '..\\integration.js')
})

test('sync-read-no-shbang', async () => {
  assert.strictEqual(readCmdShim.sync(testShimCmd), '..\\integration.js')
})

test('async-read-shbang', async () => {
  assert.strictEqual(await readCmdShim(testShbangCmd), 'test-shbang.js')
})

test('sync-read-shbang', async () => {
  assert.strictEqual(readCmdShim.sync(testShbangCmd), 'test-shbang.js')
})

test('async-read-no-shbang-cygwin', async () => {
  assert.strictEqual(await readCmdShim(testShim), '../integration.js')
})

test('sync-read-no-shbang-cygwin', async () => {
  assert.strictEqual(readCmdShim.sync(testShim), '../integration.js')
})

test('async-read-shbang-cygwin', async () => {
  assert.strictEqual(await readCmdShim(testShbang), 'test-shbang.js')
})

test('sync-read-shbang-cygwin', async () => {
  assert.strictEqual(readCmdShim.sync(testShbang), 'test-shbang.js')
})

test('async-read-no-shbang-powershell', async () => {
  assert.strictEqual(await readCmdShim(testShimPowershell), '../integration.js')
})

test('sync-read-no-shbang-powershell', async () => {
  assert.strictEqual(readCmdShim.sync(testShimPowershell), '../integration.js')
})

test('async-read-shbang-powershell', async () => {
  assert.strictEqual(await readCmdShim(testShbangPowershell), 'test-shbang.js')
})

test('sync-read-shbang-powershell', async () => {
  assert.strictEqual(readCmdShim.sync(testShbangPowershell), 'test-shbang.js')
})

test('async-read-dir', async () => {
  await assert.rejects(readCmdShim(workDir), { code: 'EISDIR' })
})

test('sync-read-dir', async () => {
  assert.throws(() => readCmdShim.sync(workDir), { code: 'EISDIR' })
})

test('async-read-not-there', async () => {
  await assert.rejects(readCmdShim('/path/to/nowhere'), { code: 'ENOENT' })
})

test('sync-read-not-there', async () => {
  assert.throws(() => readCmdShim.sync('/path/to/nowhere'), { code: 'ENOENT' })
})

test('async-read-not-shim', async () => {
  await assert.rejects(readCmdShim(__filename), { code: 'ENOTASHIM' })
})

test('sync-read-not-shim', async () => {
  assert.throws(() => readCmdShim.sync(__filename), { code: 'ENOTASHIM' })
})

after(async () => fs.rmSync(workDir, { recursive: true, force: true }))
