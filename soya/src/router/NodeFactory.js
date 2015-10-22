/**
 * Factory of node classes.
 *
 * @CLIENT_SERVER
 */
export default class NodeFactory {
  /**
   * @type {{[key: string]: Function}}
   */
  _nodeTypes;

  constructor() {
    this._nodeTypes = {};
  }

  /**
   * @param {Array<Array<any>>} nodeConfigArray
   * @return {Array<Node>}
   */
  createFromConfig(nodeConfigArray) {
    var i, nodes = [];
    for (i = 0; i < nodeConfigArray.length; i++) {
      nodes = nodes.concat(this.create(nodeConfigArray[i]));
    }
    return nodes;
  }

  /**
   * @param {Array<any>} nodeConfig
   * @return {Array<Node>}
   */
  create(nodeConfig) {
    if (nodeConfig.length < 1) {
      throw new Error('Route configuration contains node with no name!');
    }
    var nodeName = nodeConfig.slice(0, 1)[0];
    nodeConfig = nodeConfig.slice(1);
    var nodeClass = this._nodeTypes[nodeName];
    if (!nodeClass) {
      throw new Error('Route configuration contains unregistered node: ' + nodeName + '.');
    }
    var result = nodeClass.constructFromConfig(nodeConfig);
    return result;
  }

  /**
   * @param {Function} nodeClass
   */
  registerNodeType(nodeClass) {
    if (!nodeClass.nodeName) {
      throw new Error('Given Node class doesn\'t have static nodeName property: ' + nodeClass + '.');
    }
    if (this._nodeTypes.hasOwnProperty(nodeClass.nodeName)) {
      throw new Error('Clash in node name: ' + nodeClass.nodeName);
    }

    this._nodeTypes[nodeClass.nodeName] = nodeClass;
  }
}