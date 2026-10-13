// Custom blocks and a deliberately reversible subset of MicroPython.
export const OUTPUT_PINS = [2,4,5,13,14,16,17,18,19,21,22,23,25,26,27,32,33];
export const INPUT_PINS = [4,5,13,14,18,19,21,22,23,25,26,27,32,33,34,35,36,39];
export const ADC_PINS = [32,33,34,35,36,39];
const dropdown = (name, pins) => ({ type:'field_dropdown', name, options:pins.map(p=>[`GPIO ${p}`, String(p)]) });
const num = (name,value,min,max) => ({ type:'field_number',name,value,min,max,precision:1 });
const stmt = (type,message0,args0,colour)=>({type,message0,args0,previousStatement:null,nextStatement:null,colour});

export function setupBlockly(Blockly, pythonGenerator) {
  if (!Blockly.Blocks.esp_output) {
    Blockly.defineBlocksWithJsonArray([
      stmt('esp_output','GPIO %1 디지털 출력 %2',[dropdown('PIN', OUTPUT_PINS),{type:'field_dropdown',name:'VALUE',options:[['켜기 (1)','1'],['끄기 (0)','0']]}],140),
      stmt('esp_wait','%1 밀리초 기다리기',[num('MS',500,1,60000)],50),
      stmt('esp_input','GPIO %1 디지털 입력값 출력',[dropdown('PIN',INPUT_PINS)],165),
      stmt('esp_adc','GPIO %1 아날로그 값 출력',[dropdown('PIN',ADC_PINS)],165),
      stmt('esp_pwm','GPIO %1 PWM 주파수 %2 Hz 세기 %3',[dropdown('PIN',OUTPUT_PINS),num('FREQ',1000,1,20000),num('DUTY',32768,0,65535)],140),
      stmt('esp_dht','GPIO %1 DHT11 온도 출력',[dropdown('PIN',INPUT_PINS)],165),
      stmt('esp_neopixel','GPIO %1 네오픽셀 %2개 %3',[dropdown('PIN',OUTPUT_PINS),num('COUNT',8,1,60),{type:'field_dropdown',name:'COLOR',options:[['빨강','RED'],['초록','GREEN'],['파랑','BLUE'],['끄기','OFF']]}],180),
      stmt('esp_print','화면에 %1 출력',[{type:'field_input',name:'TEXT',text:'안녕하세요!'}],215),
      {type:'esp_forever',message0:'계속 반복 %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],previousStatement:null,nextStatement:null,colour:260},
      {type:'esp_repeat',message0:'%1 번 반복 %2 %3',args0:[num('COUNT',5,1,1000),{type:'input_dummy'},{type:'input_statement',name:'DO'}],previousStatement:null,nextStatement:null,colour:260},
      {type:'esp_button_if',message0:'GPIO %1 버튼이 눌렸다면 %2 %3',args0:[dropdown('PIN',INPUT_PINS),{type:'input_dummy'},{type:'input_statement',name:'DO'}],previousStatement:null,nextStatement:null,colour:315},
    ]);
  }
  const gen = pythonGenerator.forBlock;
  gen.esp_output = b => `Pin(${b.getFieldValue('PIN')}, Pin.OUT).value(${b.getFieldValue('VALUE')})\n`;
  gen.esp_wait = b => `time.sleep_ms(${b.getFieldValue('MS')})\n`;
  gen.esp_input = b => `print(Pin(${b.getFieldValue('PIN')}, Pin.IN).value())\n`;
  gen.esp_adc = b => `print(ADC(Pin(${b.getFieldValue('PIN')})).read_u16())\n`;
  gen.esp_pwm = b => `PWM(Pin(${b.getFieldValue('PIN')}), freq=${b.getFieldValue('FREQ')}, duty_u16=${b.getFieldValue('DUTY')})\n`;
  gen.esp_dht = b => `sensor = dht.DHT11(Pin(${b.getFieldValue('PIN')}))\nsensor.measure()\nprint(sensor.temperature())\n`;
  const colors={RED:'255, 0, 0',GREEN:'0, 255, 0',BLUE:'0, 0, 255',OFF:'0, 0, 0'};
  gen.esp_neopixel = b => `np = neopixel.NeoPixel(Pin(${b.getFieldValue('PIN')}), ${b.getFieldValue('COUNT')})\nnp.fill((${colors[b.getFieldValue('COLOR')]}))\nnp.write()\n`;
  gen.esp_print = b => `print(${JSON.stringify(b.getFieldValue('TEXT'))})\n`;
  gen.esp_forever = (b,g) => `while True:\n${g.statementToCode(b,'DO')||'    pass\n'}`;
  gen.esp_repeat = (b,g) => `for _ in range(${b.getFieldValue('COUNT')}):\n${g.statementToCode(b,'DO')||'    pass\n'}`;
  gen.esp_button_if = (b,g) => `if Pin(${b.getFieldValue('PIN')}, Pin.IN, Pin.PULL_UP).value() == 0:\n${g.statementToCode(b,'DO')||'    pass\n'}`;
}
export const TOOLBOX = {kind:'categoryToolbox',contents:[
  {kind:'category',name:'LED · 출력',colour:140,contents:[{kind:'block',type:'esp_output'},{kind:'block',type:'esp_pwm'}]},
  {kind:'category',name:'센서 · 입력',colour:165,contents:[{kind:'block',type:'esp_input'},{kind:'block',type:'esp_adc'},{kind:'block',type:'esp_dht'},{kind:'block',type:'esp_neopixel'}]},
  {kind:'category',name:'반복 · 조건',colour:260,contents:[{kind:'block',type:'esp_forever'},{kind:'block',type:'esp_repeat'},{kind:'block',type:'esp_button_if'},{kind:'block',type:'esp_wait'}]},
  {kind:'category',name:'데이터',colour:215,contents:[{kind:'block',type:'esp_print'}]},
]};
/** Limit early-stage toolbox to the commands needed for that mission. */
export function toolboxFor(allowedBlocks) {
  if(!allowedBlocks || !allowedBlocks.length)return TOOLBOX;
  const allow=new Set(allowedBlocks);
  return {...TOOLBOX,contents:TOOLBOX.contents.map(category=>({...category,contents:category.contents.filter(item=>allow.has(item.type))})).filter(category=>category.contents.length>0)};
}
export function toMicroPython(workspace, pythonGenerator) {
  const body=pythonGenerator.workspaceToCode(workspace).trimEnd();
  const machine='from machine import Pin'+(body.includes('ADC(')?', ADC':'')+(body.includes('PWM(')?', PWM':'');
  const imports=[machine];
  if(body.includes('time.sleep_ms(')) imports.push('import time');
  if(body.includes('dht.DHT11(')) imports.push('import dht');
  if(body.includes('neopixel.NeoPixel(')) imports.push('import neopixel');
  return imports.join('\n')+(body?'\n\n'+body+'\n':'\n');
}
export function rebuildBlocks(workspace, Blockly, nodes) {
  function build(node) {
    const block=workspace.newBlock(node.type);
    block.initSvg();
    for (const [key, value] of Object.entries(node.fields||{})) block.setFieldValue(String(value),key);
    block.render();
    let prev=null;
    for (const child of node.children||[]) {
      const next=build(child);
      if (prev) prev.nextConnection.connect(next.previousConnection);
      else block.getInput('DO').connection.connect(next.previousConnection);
      prev=next;
    }
    return block;
  }
  Blockly.Events.disable();
  try {
    workspace.clear();
    let prev=null;
    for (const node of nodes) {
      const block=build(node);
      if (prev) prev.nextConnection.connect(block.previousConnection);
      else block.moveBy(46,60);
      prev=block;
    }
  } finally { Blockly.Events.enable(); }
}
