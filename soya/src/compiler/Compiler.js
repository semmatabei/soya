import fs from 'fs';
import path from 'path';
import util from 'util';
import EntryPoint from '../EntryPoint';
import CompileResult from './CompileResult';
import AssetServer from './AssetServer';

/**
 * @SERVER
 */
export default class Compiler {
  /**
   * Run compilation. Calls the given callback with CompileResult.
   *
   * @param {Array<EntryPoint>} entryPoints
   * @param {Function} compileCallback
   */
  run(entryPoints, compileCallback) {
    compileCallback(new CompileResult());
  }

  /**
   * Assemble the HTML string for server side rendering. Compiler must also
   * set up a client runtime so that behavior events are wired properly.
   *
   * @param {string} componentName
   * @param {Object} pageDependencies
   * @param {RenderResult} renderResult
   * @param {boolean} isSecure
   * @return {string}
   */
  assembleHtml(componentName, pageDependencies, renderResult, isSecure) {
    return '';
  }

  /**
   * Used by Application to handle asset requests.
   *
   * @return {AssetServer}
   */
  getAssetServer() {
    return new AssetServer();
  }
}
