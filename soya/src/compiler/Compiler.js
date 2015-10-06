import fs from 'fs';
import path from 'path';
import util from 'util';
import EntryPoint from '../EntryPoint';
import CompileResult from './CompileResult';
import AssetServer from './AssetServer';

/**
 * Interface for compiler. Of course we only use webpack, but who knows.
 *
 * @SERVER
 */
export default class Compiler {
  /**
   * Run compilation. Calls the given callback with CompileResult. Returns
   * a list of middlewares that will be run by Application before executing
   * soya's own middleware.
   *
   * NOTE: In case of hot reloading, updateCompileResultCallback may be called
   * multiple times to update compiler
   *
   * @param {Array<EntryPoint>} entryPoints
   * @param {Function} updateCompileResultCallback
   * @return {Array<Function>}
   */
  run(entryPoints, updateCompileResultCallback) {
    updateCompileResultCallback(new CompileResult());
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
}
