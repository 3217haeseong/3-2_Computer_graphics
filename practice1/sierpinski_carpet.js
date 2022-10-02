"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1,  1 ),
        vec2(  -1, -1 ),
        vec2(  1, -1  ),
        vec2(  1, 1 )
    ];

    divideRectanle( vertices[0], vertices[1], vertices[2], vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function rectangle( a, b, c, d)
{
    points.push( a, b, c,  a, c, d);
}

function divideRectanle( a, b, c, d, count )
{

    if ( count != 5 ) {

        var ac = mix( a, c, 0.33 );
        var bd = mix( b, d, 0.33 );
        var ca = mix ( c, a, 0.33 );
        var db = mix ( d, b, 0.33);
        var ad = mix ( a, d, 0.33);
        var da = mix(d, a ,0.33);
        var ab = mix (a, b, 0.33);
        var ba = mix (b, a, 0.33);
        var dc = mix (d, c, 0.33);
        var cd = mix (c, d, 0.33);
        var bc = mix( b,c, 0.33);
        var cb = mix (c,b, 0.33);

        rectangle( ac, bd, ca, db );

        count++;

        // three new triangles

        divideRectanle( a, ab, ac, ad, count );
        divideRectanle( ad, ac, db, da, count );
        divideRectanle( da, db, dc, d, count );
        divideRectanle( ab, ba, bd, ac, count );
        divideRectanle( db, ca, cd, dc, count );
        divideRectanle( ba, b, bc, bd, count );
        divideRectanle( bd, bc, cb, ca, count );
        divideRectanle( ca, cb, c, cd, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
