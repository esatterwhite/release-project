'use strict'

const NAME_EXP = /^(?:@([^/]+?)[/])?([^/]+?)$/

module.exports = parsePkgName

function parsePkgName(pkgname) {
  const [_, scope = null, name] = (NAME_EXP.exec(pkgname) || [])
  if (!name) {
    const error = new Error(`invalid package name ${pkgname}`)
    throw error
  }
  return {scope, name}
}

