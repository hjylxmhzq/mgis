import React, { Component } from 'react';
import hjy from '../static/pics/hjy.jpg';
import ghn from '../static/pics/ghn.jpg';
import zzh from '../static/pics/zzh.jpg';
import yxy from '../static/pics/yxy.jpg';
import bg from '../static/pics/aboutusbg.jpg';
import './about.css';

export default function About() {
    return (
    <div className="aboutus">
        <img src={bg} />
        <div>
        <img src={hjy} />
        <p>胡靖元</p>
        <p>16305052</p>
        <p>hujingyuan25@163.com</p>
        <p>15217259623</p>
        </div>
        <div>
        <img src={ghn} />
        <p>郭昊南</p>
        <p>16306010</p>
        <p>guohn@mail2.sysu.edu.cn</p>
        <p>13008890354</p>
        </div>
        <div>
        <img src={zzh} />
        <p>郑泽鸿</p>
        <p>15330255</p>
        <p>zhengzh29@mail2.sysu.edu.cn</p>
        <p>13680331022</p>
        </div>
        <div>
        <img src={yxy} />
        <p>颜锌颖</p>
        <p>16305179</p>
        <p>yanxy8@mail2.sysu.edu.cn</p>
        <p>18826533020</p>
        </div>
    </div>)
}