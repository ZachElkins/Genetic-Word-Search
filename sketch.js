

window.onload = function() {
	// evolution();
}

function evolution() {

	var population = new Population(
		document.getElementById('target').value,
		document.getElementById('rate').value/100,
		document.getElementById('size').value
    );

	var running = setInterval(function() {
		document.getElementById('submit').disabled = true;
		population.natSelection();
		population.populate();
		population.evaluate();
		population.display();
		if(population.completed) {
			clearInterval(running);
			document.getElementById('submit').disabled = false;
            Array.from(document.getElementsByClassName("guess")).forEach((guess) => {
                if (guess.innerHTML == population.target)
                    guess.classList.add("found");
            });
		}
	}, 50);
}

function Population(target, mutationRate, size) {
	this.target = target;
	this.mutationRate = mutationRate;
	this.size = size;
	this.members = [];
	this.genePool = [];
	this.completed = false;
	this.generation = 0;

	for(var i = 0; i < this.size; i++)
		this.members.push(new Genome(this.target, this.mutationRate));

	this.natSelection = function() {
		for(var i = 0; i < this.members.length; i++)
			this.members[i].calcFitness();

		this.genePool = [];

		for(var i = 0; i < this.members.length; i++)
			for(var j = 0; j < this.members[i].fitness*10; j++)
				this.genePool.push(this.members[i]);
	}

	this.populate = function() {

		this.generation++;
		this.members = [];

		for(var i = 0; i < this.size; i++) {
			var a = this.genePool[Math.floor(Math.random()*this.genePool.length)].dna;
			var b = this.genePool[Math.floor(Math.random()*this.genePool.length)].dna;
			this.members.push(new Genome(this.target, this.mutationRate, a, b));
		}
	}

	this.evaluate = function() {
		for(var i = 0; i < this.members.length; i++) {
			if(this.members[i].dna === this.target)
				this.completed = true;
		}
	}

	this.calcMaxFitness = function() {
		var fittest = this.memebers[0].fitness;
		for(var i = 1; i < this.members.length; i++)
			if(this.memebers[i].fitness > fittest)
				fittest = this.memebers[i].fitness;
		return fittest;
	}

	this.display = function() {
		document.getElementById('generation').innerHTML = 'Generation | '+this.generation;
		var div = document.getElementById('pop');
		div.innerHTML = '';
		for(var i = 0; i < this.members.length; i++) {
			div.innerHTML += `<div class="guess">${this.members[i].dna}</div>`
		}
	}
}

function Genome(target, mutationRate, parentA, parentB) {
	this.dna = '';
	this.fitness = 0;
	this.target = target;
	this.mutationRate = mutationRate;

	this.mutate = function() {
		for(var i = 0; i < this.target.length; i++) {
			if(this.dna.charCodeAt(i) != this.target.charCodeAt(i))
				if(Math.random() < this.mutationRate)
					this.dna = this.dna.replaceAt(i, String.fromCharCode(Math.floor(Math.random()*94+32)));
		}
	}

	if(!parentA && !parentB) {
		for(var i = 0; i < this.target.length; i++)
			this.dna += String.fromCharCode(Math.floor(Math.random()*94+32));
	} else {
		var mid = Math.floor(Math.random()*this.target.length);
		this.dna = parentA.substr(0, mid) + parentB.substr(mid, parentB.length);
		this.mutate();
	}

	this.calcFitness = function() {
		this.fitness = 0;
		for(var i = 0; i < this.target.length; i++) {
			if(this.dna.charCodeAt(i) === this.target.charCodeAt(i))
				this.fitness++;
		}
		this.fitness = this.fitness.map(0, this.target.length, 0.1, this.target.length);
	}

}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}
