import './main.css';//使用require导入css文件
import React from 'react';
import {render} from 'react-dom';
import Greeter from './reactGreeter';


render(<Greeter />, document.getElementById('root'));
