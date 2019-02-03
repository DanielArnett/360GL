(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{123:function(e,t,n){e.exports=n(355)},128:function(e,t,n){},130:function(e,t,n){},355:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),i=n(16),r=n.n(i),l=(n(128),n(65)),c=n(45),s=n(47),p=n(46),u=n(35),h=n(48),v=n(34),d=(n(6),n(66)),f=n.n(d),m=n(15),g=n.n(m),C=(n(130),n(120)),x=n(36),E=n(121);function L(){var e=Object(C.a)(['\n    // TODO turn this into its own .frag file.\n      precision highp float;\n      float PI = 3.14159265359;\n      vec2 SET_TO_TRANSPARENT = vec2(-1.0, -1.0);\n      vec4 TRANSPARENT_PIXEL = vec4(0.0, 0.0, 0.0, 0.0);\n      bool FISHEYE_RADIAL_CORRECTION = true;\n      uniform float correction1, correction2, correction3, correction4, cropTop, cropBottom, cropLeft, cropRight, xCenter;\n      uniform sampler2D InputTexture;\n      uniform float pitch, roll, yaw, fovIn, fovOut, x, y, z;\n      uniform int inputProjection, outputProjection, gridLines, width, height;\n      uniform float test;\n      varying vec2 uv;\n      bool isTransparent = false;\n      const int EQUI = 0;\n      const int FISHEYE = 1;\n      const int FLAT = 2;\n      const int SPHERE = 3;\n      const int GRIDLINES_OFF = 0;\n      const int GRIDLINES_ON = 1;\n\n      // uniform vec3 InputRotation;\n      // A transformation matrix rotating about the x axis by th degrees.\n      mat3 Rx(float th)\n      {\n          return mat3(1, 0, 0,\n                      0, cos(th), -sin(th),\n                      0, sin(th), cos(th));\n      }\n      // A transformation matrix rotating about the y axis by th degrees.\n      mat3 Ry(float th)\n      {\n          return mat3(cos(th), 0, sin(th),\n                         0,    1,    0,\n                      -sin(th), 0, cos(th));\n      }\n      // A transformation matrix rotating about the z axis by th degrees.\n      mat3 Rz(float th)\n      {\n          return mat3(cos(th), -sin(th), 0,\n                      sin(th),  cos(th), 0,\n                        0,         0   , 1);\n      }\n\n      // Rotate a point vector by th.x then th.y then th.z, and return the rotated point.\n      vec3 rotatePoint(vec3 p, vec3 th)\n      {\n        return Rx(th.x) * Ry(th.y) * Rz(th.z) * p;\n      }\n\n      // Convert a 3D point on the unit sphere into latitude and longitude.\n      // In more mathy terms we\'re converting from "Cartesian Coordinates" to "Spherical Coordinates"\n      vec2 pointToLatLon(vec3 point)\n      {\n        float r = distance(vec3(0.0, 0.0, 0.0), point);\n        vec2 latLon;\n        latLon.x = asin(point.z / r);\n        latLon.y = atan(point.x, point.y);\n        return latLon;\n      }\n\n      // Convert latitude, longitude into a 3d point on the unit-sphere.\n      // In more mathy terms we\'re converting from  "Spherical Coordinates" to "Cartesian Coordinates"\n      vec3 latLonToPoint(vec2 latLon)\n      {\n          float lat = latLon.x;\n          float lon = latLon.y;\n          vec3 point;\n          point.x = cos(lat) * sin(lon);\n          point.y = cos(lat) * cos(lon);\n          point.z = sin(lat);\n          return point;\n      }\n\n      // Convert pixel coordinates from an Equirectangular image into latitude/longitude coordinates.\n      vec2 equiUvToLatLon(vec2 local_uv)\n      {\n          return vec2(local_uv.y * PI - PI/2.0,\n                      local_uv.x * 2.0*PI - PI);\n      }\n\n      // Convert  pixel coordinates from an Fisheye image into latitude/longitude coordinates.\n      vec2 fisheyeUvToLatLon(vec2 local_uv, float fovOutput)\n      {\n        vec2 pos = 2.0 * local_uv - 1.0;\n        // The distance from the source pixel to the center of the image\n        float r = distance(vec2(0.0,0.0),pos.xy);\n        // Don\'t bother with pixels outside of the fisheye circle\n        if (1.0 < r) {\n          isTransparent = true;\n          return SET_TO_TRANSPARENT;\n        }\n        float theta = atan(r,1.0);\n        // phi is the angle of r on the unit circle. See polar coordinates for more details\n        float phi = atan(pos.x,-pos.y);\n        r = tan(theta/fovOutput);\n        vec2 latLon;\n        latLon.x = (1.0 - r)*PI/2.0;\n        // Calculate longitude\n        latLon.y = PI + atan(-pos.x, pos.y);\n          \n        if (latLon.y < 0.0) {\n          latLon.y += 2.0*PI;\n        }\n        vec3 point = latLonToPoint(latLon);\n        point = rotatePoint(point, vec3(PI/2.0, 0.0, 0.0));\n        latLon = pointToLatLon(point);\n        return latLon;\n      }\n\n      vec2 sphericalUvToLatLon(vec2 local_uv)\n      {\n          // Return a isTransparent pixel\n          isTransparent = true;\n          return SET_TO_TRANSPARENT;\n      }\n      \n      vec2 flatImageUvToLatLon(vec2 local_uv, float fovOutput)\n      {\n        // Position of the source pixel in uv coordinates in the range [-1,1]\n        vec2 pos = 2.0 * local_uv - 1.0;\n        float aspectRatio = float(width)/float(height);\n        vec3 point = vec3(pos.x*aspectRatio, 1.0/fovOutput, pos.y);\n        return pointToLatLon(point);\n      }\n\n\n      \n      // Convert latitude, longitude into a 3d point on the unit-sphere.\n      vec3 flatLatLonToPoint(vec2 latLon)\n      {\n        vec3 point = latLonToPoint(latLon);\n        // Get phi of this point, see polar coordinate system for more details.\n        float phi = atan(point.x, -point.y);\n        // With phi, calculate the point on the image plane that is also at the angle phi\n        point.x = sin(phi) * tan(PI / 2.0 - latLon.x);\n        point.y = cos(phi) * tan(PI / 2.0 - latLon.x);\n        point.z = 1.0;\n        return point;\n      }\n      // Convert latitude, longitude to x, y pixel coordinates on an equirectangular image.\n      vec2 latLonToEquiUv(vec2 latLon)\n      {\n          vec2 local_uv;\n          local_uv.x = (latLon.y + PI)/(2.0*PI);\n          local_uv.y = (latLon.x + PI/2.0)/PI;\n\n          // Set to transparent if out of bounds\n          if (local_uv.x < -1.0 || local_uv.y < -1.0 || local_uv.x > 1.0 || local_uv.y > 1.0) {\n            // Return a isTransparent pixel\n            isTransparent = true;\n            return SET_TO_TRANSPARENT;\n          }\n          return local_uv;\n      }\n      \n      // Convert latitude, longitude to x, y pixel coordinates on the source fisheye image.\n      vec2 pointToFisheyeUv(vec3 point, float fovInput, vec4 fishCorrect)\n      {\t\n        point = rotatePoint(point, vec3(-PI/2.0, 0.0, 0.0));\n        // Phi and theta are flipped depending on where you read about them.\n        float theta = atan(distance(vec2(0.0,0.0),point.xy),point.z);\n        // The distance from the source pixel to the center of the image\n        float r = (2.0/PI)*(theta/fovInput);\n        if (FISHEYE_RADIAL_CORRECTION)\n        {\n          // Do radial correction. \n          // Source: http://paulbourke.net/dome/fisheyecorrect/\n          r *= 2.0 * (fishCorrect.x + theta * (fishCorrect.y + theta * (fishCorrect.z + theta * fishCorrect.w)));\n        }\n\n        // phi is the angle of r on the unit circle. See polar coordinates for more details\n        float phi = atan(-point.y, point.x);\n        // Get the position of the source pixel\n        vec2 sourcePixel;\n        sourcePixel.x = r * cos(phi);\n        sourcePixel.y = r * sin(phi);\n        // Normalize the output pixel to be in the range [0,1]\n        sourcePixel += 1.0;\n        sourcePixel /= 2.0;\n        // Don\'t bother with source pixels outside of the fisheye circle\n        if (1.0 < r || sourcePixel.x < 0.0 || sourcePixel.y < 0.0 || sourcePixel.x > 1.0 || sourcePixel.y > 1.0) {\n          // Return a isTransparent pixel\n          isTransparent = true;\n          return SET_TO_TRANSPARENT;\n        }\n        return sourcePixel;\n      }\n      \n      bool outOfFlatBounds(vec2 xy, float lower, float upper)\n      {\n        vec2 lowerBound = vec2(lower, lower);\n        vec2 upperBound = vec2(upper, upper);\n        return (any(lessThan(xy, lowerBound)) || any(greaterThan(xy, upperBound)));\n      }\n      vec2 latLonToFlatUv(vec2 latLon, float fovInput)\n      {\n        vec3 point = rotatePoint(latLonToPoint(latLon), vec3(-PI/2.0, 0.0, 0.0));\n        latLon = pointToLatLon(point);\n        float aspectRatio = float(width)/float(height);\n\n        vec2 xyOnImagePlane;\n        vec3 p;\n        if (latLon.x < 0.0) \n        {\n          isTransparent = true;\n          return SET_TO_TRANSPARENT;\n        }\n        // Derive a 3D point on the plane which correlates with the latitude and longitude in the fisheye image.\n        p = flatLatLonToPoint(latLon);\n        p.x /= aspectRatio;\n        // Control the scale with the user\'s fov input parameter.\n        p.xy *= fovInput;\n        // Position of the source pixel in the source image in the range [-1,1]\n        xyOnImagePlane = p.xy / 2.0 + 0.5;\n        if (outOfFlatBounds(xyOnImagePlane, 0.0, 1.0)) \n    \t\t{\n          isTransparent = true;\n          return SET_TO_TRANSPARENT;\n        }\n        return xyOnImagePlane;\n      }\n      void main()\n      {\n        vec2 temp_uv = uv;\n        temp_uv.x = (temp_uv.x * float(width) / float(height)) - 0.5;\n        if (gridLines == GRIDLINES_ON && outputProjection == FISHEYE)\n        {\n          if (abs(distance(vec2(0.0, 0.0), 2.0 * temp_uv - 1.0) - 1.0) < 0.01)\n          {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n            return;\n          }\n        }\n        vec3 InputRotation = vec3(pitch, roll, yaw);\n        vec4 fragColor = vec4(0.0, 0.0, 0.0, 0.0);\n        vec4 centerFragColor = vec4(0.0, 0.0, 0.0, 0.0);\n        float fovInput = fovIn;\n        float fovOutput = fovOut;\n        vec4 fishCorrect = vec4(correction1-0.5, correction2, correction3, correction4);\n        fishCorrect.yzw -= 1.0;\n        float lineCount = 0.0;\n        // Level Of Detail: how fast should this run?\n        // Set LOD to 0 to run fast, set to two to blur the image, reducing jagged edges\n        const int LOD = 1;\n        //TODO Make Antialiasing a little smarter than this.\n        for(int i = -LOD; i <= LOD; i++)\n        {\n          for(int j = -LOD; j <= LOD; j++)\n          {\n            isTransparent = false;\n\n            \n            vec2 uv_aa = uv + vec2(i, j)/vec2(width, height);\n\n            \n            // vec2 newDimensions = vec2(cropRight-1.0 - cropLeft-1.0, cropTop-1.0 - cropBottom-1.0)\n            // uv_aa = uv_aa\n            // Given some pixel (uv), find the latitude and longitude of that pixel\n            vec2 latLon;\n            if (outputProjection == EQUI)\n              latLon = equiUvToLatLon(uv_aa);\n            else if(outputProjection == FISHEYE)\n            {\n              uv_aa.x = (uv_aa.x * float(width) / float(height)) - 0.5;\n              latLon = fisheyeUvToLatLon(uv_aa, fovOutput);\n            }\n            else if (outputProjection == FLAT)\n              latLon = flatImageUvToLatLon(uv_aa, fovOutput);\n            else if (outputProjection == SPHERE)\n              latLon = sphericalUvToLatLon(uv_aa);\n            // If a pixel is out of bounds, set it to be transparent\n            if (isTransparent)\n            {\n              continue;\n            }\n            // Create a point on the unit-sphere from the calculated latitude and longitude\n            // This sphere uses a right-handed coordinate system\n              // X increases from left to right [-1 to 1]\n              // Y increases from back to front [-1 to 1]\n              // Z increases from bottom to top [-1 to 1]\n            vec3 point = latLonToPoint(latLon);\n            // X, Y, Z translation inputs from the user.\n            vec3 translation = 5.0*(vec3(x, y, z) - 1.0); \n            // Rotate the point based on the user input in radians\n            point = rotatePoint(point, InputRotation.rgb * PI);\n            point.xyz += translation;\n            if (distance(vec3(0.0, 0.0, 0.0), translation) > 1.0 && distance(vec3(0.0, 0.0, 0.0), point) > distance(vec3(0.0, 0.0, 0.0), translation))\n            {\n              isTransparent = true;\n              continue;\n            }\n            // Convert back to latitude and longitude\n            latLon = pointToLatLon(point);\n            // if (1.0 < distance(point, vec3(0.0, 0.0, 0.0)))\n            // {\n            //   // isTransparent == true;\n            //   gl_FragColor = vec4(latLon.x, latLon.y, 0.0, 1.0);\n            //   return;\n            // }\n            // Convert back to the normalized pixel coordinate\n            vec2 sourcePixel;\n            if (inputProjection == EQUI)\n              sourcePixel = latLonToEquiUv(latLon);\n            else if (inputProjection == FISHEYE)\n              sourcePixel = pointToFisheyeUv(point, fovInput, fishCorrect);\n            else if (inputProjection == FLAT)\n              sourcePixel = latLonToFlatUv(latLon, fovInput);\n\n            vec2 croppedUv = 2.0*sourcePixel-1.0;\n            float croppedWidth = cropRight - (cropLeft - 1.0);\n            float croppedHeight = cropTop - (cropBottom - 1.0);\n            // gl_FragColor = vec4(croppedWidth, 0.0, 0.0, 1.0);\n            // return;\n            croppedUv = vec2(croppedUv.x / cropRight, croppedUv.y / cropTop);\n            float newWidth = float(width) / (croppedWidth + 1.0);\n            float newHeight = float(newWidth) / float(height) ;\n            croppedUv.y /= newHeight;\n            croppedUv = 0.5*croppedUv+0.5;\n            croppedUv.x += xCenter - 1.0;\n            if (croppedUv.x < 0.0  || croppedUv.y < 0.0 || 1.0 < croppedUv.x || 1.0 < croppedUv.y)\n            {\n              continue;\n              // gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n              // return;\n            }\n            // If a pixel is out of bounds, set it to be transparent\n            else if (isTransparent)\n            {\n              continue;\n            }\n            // Set the color of the destination pixel to the color of the source pixel\n            vec4 color = texture2D(InputTexture, croppedUv);\n\n            if (inputProjection == EQUI && gridLines == GRIDLINES_ON)\n            {\n              float minDistance = 0.3;\n              float lineThickness = minDistance;\n              for (float i = -18.0; i <= 18.0; i += 1.0)\n              {\n                float distanceToLine = abs(degrees(latLon.y) - i*10.0);\n                if (distanceToLine <= minDistance)\n                  minDistance = distanceToLine;\n                distanceToLine = abs(degrees(latLon.x) - i*10.0);\n                if (distanceToLine <= minDistance)\n                  minDistance = distanceToLine;\n              }\n              if (minDistance < lineThickness)\n              {\n                color = vec4(0.0, 0.0, 0.0, 1.0);\n                lineCount += 1.0;\n              }\n            }\n            fragColor += color;\n            if (i == 0 && j == 0)\n            {\n              // This is the aliased pixel. If we didn\'t do antialiasing this is the pixel we\'d get.\n              centerFragColor = color;\n            }\n          }\n        }\n        // antiAliasCount: how many pixels the above loop should have calculated\n        float antiAliasCount = float((1+2*LOD)*(1+2*LOD));\n        // If the pixel has any transparency (i.e. the sourcePixel is at the perimeter of the image) then do antialiasing\n        if (fragColor.a < antiAliasCount || lineCount > 0.0)\n        {\n          // Apply antialiasing. Remove the if/else statement if you want to antialias the whole image.\n          gl_FragColor = fragColor / antiAliasCount;\n          \n        }\n        else\n        {\n          // Ignore antialiasing\n          gl_FragColor = centerFragColor;\n        }\n      }\n\n    ']);return L=function(){return e},e}var T=x.Shaders.create({Reproject:{frag:Object(x.GLSL)(L())}}),y=function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.pitch,n=e.roll,o=e.yaw,i=e.inputProjection,r=e.fovIn,l=e.fovOut,c=e.x,s=e.y,p=e.z,u=e.correction1,h=e.correction2,v=e.correction3,d=e.correction4,f=e.cropTop,m=e.cropBottom,g=e.cropLeft,C=e.cropRight,L=e.xCenter,y=e.outputProjection,P=e.gridLines,O=(e.width,e.height,e.sourceImage),I=e.test;return a.a.createElement(E.Surface,{width:1400,height:700},a.a.createElement(x.Node,{shader:T.Reproject,uniforms:{pitch:t,roll:n,yaw:o,fovIn:r,fovOut:l,x:c,y:s,z:p,correction1:u,correction2:h,correction3:v,correction4:d,cropTop:f,cropBottom:m,cropLeft:g,cropRight:C,xCenter:L,inputProjection:i,outputProjection:y,gridLines:P,width:1400,height:700,InputTexture:O,test:I}}))}}]),t}(o.Component),P=n(28),O=n.n(P),I=n(17),R=n.n(I),w=(n(189),function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(s.a)(this,Object(p.a)(t).call(this,e))).state={pitch:1,roll:1,yaw:1,fovIn:1,fovOut:1,x:1,y:1,z:1,correction1:1,correction2:1,correction3:1,correction4:1,cropTop:1,cropBottom:1,cropLeft:1,cropRight:1,xCenter:1,inputProjection:0,outputProjection:0,gridLines:0,pictures:[],sourceImage:"earth.jpg",name:"",uploadedImage:"",test:1,url:""},n.handleChange=function(e){n.setState(Object(l.a)({},e.target.name,e.target.value))},n.handleUrlChange=function(e){n.setState({url:e.target.value})},n.handlePitchChange=function(e,t){n.setState({pitch:t/50})},n.handleRollChange=function(e,t){n.setState({roll:t/50})},n.handleYawChange=function(e,t){n.setState({yaw:t/50})},n.handleFovInChange=function(e,t){n.setState({fovIn:t/50})},n.handleFovOutChange=function(e,t){n.setState({fovOut:t/50})},n.handleCorrection1Change=function(e,t){n.setState({correction1:t/50})},n.handleCorrection2Change=function(e,t){n.setState({correction2:t/50})},n.handleCorrection3Change=function(e,t){n.setState({correction3:t/50})},n.handleCorrection4Change=function(e,t){n.setState({correction4:t/50})},n.handleXChange=function(e,t){n.setState({x:t/50})},n.handleYChange=function(e,t){n.setState({y:t/50})},n.handleZChange=function(e,t){n.setState({z:t/50})},n.handleSliderChange=function(e,t){n.setState(Object(l.a)({},e.target.name,e.target.value/50))},n.handleCropTopChange=function(e,t){n.setState({cropTop:t/50,cropBottom:2-t/50})},n.handleCropBottomChange=function(e,t){n.setState({cropBottom:t/50,cropTop:2-t/50})},n.handleCropLeftChange=function(e,t){n.setState({cropLeft:t/50,cropRight:2-t/50})},n.handleCropRightChange=function(e,t){n.setState({cropRight:t/50,cropLeft:2-t/50})},n.handleXCenterChange=function(e,t){n.setState({xCenter:t/50})},n.handleTestChange=function(e,t){n.setState({test:t/50})},n.onDrop=n.onDrop.bind(Object(v.a)(Object(v.a)(n))),n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"handleSubmit",value:function(e){alert("A name was submitted: "+this.state.url),e.preventDefault()}}]),Object(u.a)(t,[{key:"onDrop",value:function(e){this.setState({pictures:e,uploadedImage:e[e.length-1].name,sourceImage:e[e.length-1].name})}},{key:"render",value:function(){var e=this.state,t=e.pitch,n=e.roll,o=e.yaw,i=e.fovIn,r=e.fovOut,l=e.x,c=e.y,s=e.z,p=e.correction1,u=e.correction2,h=e.correction3,v=e.correction4,d=e.cropTop,m=e.cropBottom,C=e.cropLeft,x=e.cropRight,E=e.xCenter,L=e.inputProjection,T=e.outputProjection,P=e.gridLines,I=e.sourceImage,w=(e.url,e.test);return a.a.createElement("div",{className:"App-container"},a.a.createElement("div",{className:"App-slider"},a.a.createElement(f.a,{id:"outlined-name",label:"URL",className:f.a,value:this.state.url,onChange:this.handleUrlChange,margin:"normal",variant:"outlined"}),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Source Image"),a.a.createElement(O.a,{value:this.state.sourceImage,onChange:this.handleChange,inputProps:{name:"sourceImage",id:"sourceImage"}},a.a.createElement(R.a,{value:"earth.jpg"},"Earth"),a.a.createElement(R.a,{value:"sru.jpg"},"Rectilinear Photo"),a.a.createElement(R.a,{value:"radial.jpg"},"Fisheye Grid"),a.a.createElement(R.a,{value:"360planetarium.jpg"},"360 Photo"),a.a.createElement(R.a,{value:this.state.url},"URL"))),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Input Projection"),a.a.createElement(O.a,{value:this.state.inputProjection,onChange:this.handleChange,inputProps:{name:"inputProjection",id:"inputProjection"},displayEmpty:!0},a.a.createElement(R.a,{value:0},"Equirectangular"),a.a.createElement(R.a,{value:1},"Fisheye"),a.a.createElement(R.a,{value:2},"Rectilinear"))),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Output Projection"),a.a.createElement(O.a,{value:this.state.outputProjection,onChange:this.handleChange,inputProps:{name:"outputProjection",id:"outputProjection"}},a.a.createElement(R.a,{value:0},"Equirectangular"),a.a.createElement(R.a,{value:1},"Fisheye"),a.a.createElement(R.a,{value:2},"Rectilinear"))),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Grid Lines"),a.a.createElement(O.a,{value:this.state.gridLines,onChange:this.handleChange,inputProps:{name:"gridLines",id:"gridLines"}},a.a.createElement(R.a,{value:0},"Off"),a.a.createElement(R.a,{value:1},"On"))),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Pitch: ",(180*(this.state.pitch-1)).toFixed(1)," degrees"),a.a.createElement(g.a,{value:50*t,onChange:this.handlePitchChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Roll: ",(180*(this.state.roll-1)).toFixed(1)," degrees"),a.a.createElement(g.a,{value:50*n,onChange:this.handleRollChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Yaw: ",(180*(this.state.yaw-1)).toFixed(1)," degrees"),a.a.createElement(g.a,{value:50*o,onChange:this.handleYawChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Field of View In: ",(180*this.state.fovIn).toFixed(1)," degrees"),a.a.createElement(g.a,{value:50*i,onChange:this.handleFovInChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Field of View Out: ",this.state.fovOut.toFixed(2)),a.a.createElement(g.a,{value:50*r,onChange:this.handleFovOutChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"X: ",(5*(this.state.x-1)).toFixed(1)," meters"),a.a.createElement(g.a,{value:50*l,onChange:this.handleXChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Y: ",(5*(this.state.y-1)).toFixed(1)," meters"),a.a.createElement(g.a,{value:50*c,onChange:this.handleYChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Z: ",(5*(this.state.z-1)).toFixed(1)," meters"),a.a.createElement(g.a,{value:50*s,onChange:this.handleZChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Crop Top: ",(1400*(this.state.cropTop-1)/4).toFixed(0)," pixels"),a.a.createElement(g.a,{value:50*d,onChange:this.handleCropTopChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Crop Bottom: ",(1400*(this.state.cropBottom-1)/4).toFixed(0)," pixels"),a.a.createElement(g.a,{value:50*m,onChange:this.handleCropBottomChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Crop Left  ",(1400*(this.state.cropLeft-1)/4).toFixed(0)," pixels"),a.a.createElement(g.a,{value:50*C,onChange:this.handleCropLeftChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Crop Right ",(1400*(this.state.cropRight-1)/4).toFixed(0)," pixels"),a.a.createElement(g.a,{value:50*x,onChange:this.handleCropRightChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"X Center : ",(1400*(this.state.xCenter-1)/2).toFixed(0)," pixels"),a.a.createElement(g.a,{value:50*E,onChange:this.handleXCenterChange})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Fisheye Correction 1: ",(this.state.correction1-.5).toFixed(4)," r"),a.a.createElement(g.a,{value:50*p,onChange:this.handleCorrection1Change})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Fisheye Correction 2: ",(this.state.correction2-1).toFixed(4)," r^2"),a.a.createElement(g.a,{value:50*u,onChange:this.handleCorrection2Change})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Fisheye Correction 3: ",(this.state.correction3-1).toFixed(4)," r^3"),a.a.createElement(g.a,{value:50*h,onChange:this.handleCorrection3Change})),a.a.createElement("div",{className:"App-Options"},a.a.createElement("p",null,"Fisheye Correction 4: ",(this.state.correction4-1).toFixed(4)," r^4"),a.a.createElement(g.a,{value:50*v,onChange:this.handleCorrection4Change}))),a.a.createElement("div",{className:"App-Projection"},a.a.createElement(y,{pitch:t,roll:n,yaw:o,fovIn:i,fovOut:r,x:l,y:c,z:s,xCenter:E,correction1:p,correction2:u,correction3:h,correction4:v,cropTop:d,cropBottom:m,cropLeft:C,cropRight:x,inputProjection:L,outputProjection:T,gridLines:P,sourceImage:I,test:w})))}}]),t}(o.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[123,2,1]]]);
//# sourceMappingURL=main.639c4455.chunk.js.map