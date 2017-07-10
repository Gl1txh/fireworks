var vec2 = function(x = 0, y = 0, z = 0) {

	this.x = x;
	this.y = y;
	this.z = z;

	this.add = function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	this.sub = function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	this.mult = function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	this.mag = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}

	this.norm = function() {
		var m = this.mag();
		this.x /= m;
		this.y /= m;
		return this;
	}

	this.dot = function(v) {
		return this.x * v.x + this.y * v.y;
	}

	this.cross = function(v) {
		// cross product returns a vector in 3D, not in 2D
		// think of this as computing the z component for the vectors lying
		// in the x,y plane
		return this.x * v.x - this.y * v.y;
	}

	this.inverse = function() {
		this.x *= -1;
		this.y *= -1;
		return this;
	}

	this.perpendicular = function(clockwise = true) {
		if (clockwise) {
			return new vec2(this.y, -this.x);
		} else {
			return new vec2(-this.y, this.x);
		}
	}

	this.rotate = function(a) {
		var sina = Math.sin(a);
		var cosa = Math.cos(a);
		var rx = this.x * cosa - this.y * sina;
		var ry = this.x * sina + this.y * cosa;
		this.x = rx;
		this.y = ry;
		return this;
	}

	this.copy = function() {
		return new vec2(this.x, this.y);
	}

	this.toString = function() {
		return "x: " + this.x.toFixed(2) + ", y:" + this.y.toFixed(2);
	}

	this.render = function(context, ox = 0, oy = 0, color = "#FF330088", minLen = 42) {

		if (this.mag() < 0.001) return;

		context.save();

		var cp = this.copy();
		if (cp.mag() < minLen) {
			cp.norm();
			cp.mult(minLen);
		}
		context.fillStyle = "";
		context.lineWidth = 2;
		context.strokeStyle = color;
		context.lineCap = "square";
		context.beginPath();
		context.moveTo(ox, oy);
		context.lineTo(ox + cp.x, oy + cp.y);
		// arrow
		var r = 16;
		var a = Math.atan2(cp.y, cp.x) - Math.PI;
		var da = 30 * (Math.PI/180);
		var p1x = ox + cp.x + Math.cos(a-da)*r;
		var p1y = oy + cp.y + Math.sin(a-da)*r;
		var p2x = ox + cp.x + Math.cos(a+da)*r;
		var p2y = oy + cp.y + Math.sin(a+da)*r;
		context.moveTo(ox + cp.x, oy + cp.y);
		context.lineTo(p1x, p1y);
		context.moveTo(ox + cp.x, oy + cp.y);
		context.lineTo(p2x, p2y);
		context.stroke();

		context.restore();

	}

}
