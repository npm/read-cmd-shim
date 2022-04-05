'use strict'
const { join, basename } = require('path')
const fs = require('graceful-fs')
const test = require('tap').test
const rimraf = require('rimraf')
const cmdShim = require('cmd-shim')
const readCmdShim = require('..')
const workDir = join(__dirname, basename(__filename, '.js'))
const testShbang = join(workDir, 'test-shbang')
const testShbangCmd = testShbang + '.cmd'
const testShbangPowershell = testShbang + '.ps1'
const testShim = join(workDir, 'test')
const testShimCmd = testShim + '.cmd'
const testShimPowershell = testShim + '.ps1'

test('setup', t => {
  rimraf.sync(workDir)
  fs.mkdirSync(workDir)
  fs.writeFileSync(testShbang + '.js', '#!/usr/bin/env node\ntrue')
  return Promise.all([
    cmdShim(__filename, testShim),
    cmdShim(testShbang + '.js', testShbang),
  ])
})

test('async-read-no-shebang', async t =>
  t.equal(await readCmdShim(testShimCmd), '..\\integration.js'))

test('sync-read-no-shbang', async t =>
  t.equal(readCmdShim.sync(testShimCmd), '..\\integration.js'))

test('async-read-shbang', async t =>
  t.equal(await readCmdShim(testShbangCmd), 'test-shbang.js'))

test('sync-read-shbang', async t =>
  t.equal(readCmdShim.sync(testShbangCmd), 'test-shbang.js'))

test('async-read-no-shbang-cygwin', async t =>
  t.equal(await readCmdShim(testShim), '../integration.js'))

test('sync-read-no-shbang-cygwin', async t =>
  t.equal(readCmdShim.sync(testShim), '../integration.js'))

test('async-read-shbang-cygwin', async t =>
  t.equal(await readCmdShim(testShbang), 'test-shbang.js'))

test('sync-read-shbang-cygwin', async t =>
  t.equal(readCmdShim.sync(testShbang), 'test-shbang.js'))

test('async-read-no-shbang-powershell', async t =>
  t.equal(await readCmdShim(testShimPowershell), '../integration.js'))

test('sync-read-no-shbang-powershell', async t =>
  t.equal(readCmdShim.sync(testShimPowershell), '../integration.js'))

test('async-read-shbang-powershell', async t =>
  t.equal(await readCmdShim(testShbangPowershell), 'test-shbang.js'))

test('sync-read-shbang-powershell', async t =>
  t.equal(readCmdShim.sync(testShbangPowershell), 'test-shbang.js'))

test('async-read-dir', t =>
  t.rejects(readCmdShim(workDir), { code: 'EISDIR' }))

test('sync-read-dir', async t =>
  t.throws(() => readCmdShim.sync(workDir), { code: 'EISDIR' }))

test('async-read-not-there', t =>
  t.rejects(readCmdShim('/path/to/nowhere'), { code: 'ENOENT' }))

test('sync-read-not-there', async t =>
  t.throws(() => readCmdShim.sync('/path/to/nowhere'), { code: 'ENOENT' }))

test('async-read-not-shim', t =>
  t.rejects(readCmdShim(__filename), { code: 'ENOTASHIM' }))

test('sync-read-not-shim', async t =>
  t.throws(() => readCmdShim.sync(__filename), { code: 'ENOTASHIM' }))

test('cleanup', async t => rimraf.sync(workDir))
